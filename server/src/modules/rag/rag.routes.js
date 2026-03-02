const express = require("express");
const axios = require("axios");
const authMiddleware = require("../../middleware/auth.middleware");
const { askQuestion, generateTitle } = require("./rag.service");
const {
  saveMessage,
  getConversationMessages,
} = require("../message/message.service");
const {
  updateConversationTitle,
} = require("../conversation/conversation.service");
const Conversation = require("../conversation/conversation.model");

const router = express.Router();

router.post("/ask", authMiddleware, async (req, res, next) => {
  try {
    const { question, conversationId } = req.body;

    if (!question || !conversationId) {
      return res.status(400).json({
        success: false,
        message: "Question and conversationId required",
      });
    }

    // 1️⃣ Save user message
    await saveMessage({
      conversationId,
      role: "user",
      content: question,
    });

    // 2️⃣ Get conversation
    const conversation = await Conversation.findById(conversationId);

    // 3️⃣ Check if first message & default title
    const previousMessages =
      await getConversationMessages(conversationId);

    if (
      previousMessages.length === 1 &&
      conversation.title === "New Chat"
    ) {
      const newTitle = await generateTitle(question);
      await updateConversationTitle(conversationId, newTitle);
    }

    // 4️⃣ Ask RAG with memory
    const result = await askQuestion(
      question,
      previousMessages
    );

    // 5️⃣ Save assistant message
    await saveMessage({
      conversationId,
      role: "assistant",
      content: result.answer,
      sources: result.sources,
    });

    res.set("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});


router.post("/stream", authMiddleware, async (req, res) => {
  try {
    const { question, conversationId } = req.body;

    if (!question || !conversationId) {
      return res.status(400).json({
        success: false,
        message: "Question and conversationId required",
      });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Save user message
    await saveMessage({
      conversationId,
      role: "user",
      content: question,
    });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: question }],
          },
        ],
      }
    );

    let fullText = "";

    // Loop through structured chunks
    for (const chunk of response.data) {
      const text =
        chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (text) {
        fullText += text;

        res.write(
          `data: ${JSON.stringify({ text })}\n\n`
        );
      }
    }

    // 🔥 Only save if content exists
    if (fullText.trim()) {
      await saveMessage({
        conversationId,
        role: "assistant",
        content: fullText,
      });
    }

    res.write(`data: [DONE]\n\n`);
    res.end();

  } catch (error) {
    console.error("Streaming error:", error);
    res.end();
  }
});

module.exports = router;
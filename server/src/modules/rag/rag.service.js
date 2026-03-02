const axios = require("axios");
const { retrieveRelevantChunks } = require("./retrieval.service");
const { buildPrompt } = require("./prompt.service");

const askQuestion = async (question, previousMessages = []) => {
  try {
    if (!question) {
      throw { status: 400, message: "Question is required" };
    }

    // 🔹 1️⃣ Retrieve relevant document chunks
    const retrievedChunks = await retrieveRelevantChunks(question, 5);

    // 🔹 2️⃣ Build conversation history string
    const conversationHistory = previousMessages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n");

    // 🔹 3️⃣ Build final prompt
    const prompt = buildPrompt({
      question,
      retrievedChunks,
      conversationHistory,
    });

    // 🔹 4️⃣ Gemini API Call
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    return {
      answer: text,
      sources: retrievedChunks.map((chunk) => chunk.text),
    };
  } catch (error) {
    console.error("Gemini RAG Error:", error.response?.data || error.message);
    throw {
      status: 500,
      message: "Failed to process Gemini RAG request",
    };
  }
};


const generateTitle = async (question) => {
  try {
    const prompt = `
Generate a very short and concise chat title (max 5 words)
for the following user query.

Only return the title. No quotes. No extra text.

User Query:
${question}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const title =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "New Chat";

    return title;
  } catch (error) {
    console.error("Title Generation Error:", error.message);
    return "New Chat";
  }
};

module.exports = {
  askQuestion,
  generateTitle,
};
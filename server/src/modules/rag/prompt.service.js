const buildPrompt = ({
  question,
  retrievedChunks = [],
  conversationHistory = "",
}) => {
  return `
You are an intelligent AI assistant.

Conversation History:
${conversationHistory}

Relevant Document Context:
${retrievedChunks.map((chunk) => chunk.text).join("\n\n")}

User Question:
${question}

Instructions:
- Use conversation history for context.
- Use document context when relevant.
- If answer is not found, say you don't know.
- Keep response clear and structured.
`;
};

module.exports = { buildPrompt };
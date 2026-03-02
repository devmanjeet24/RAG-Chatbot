const Vector = require("./vector.model");
const { generateEmbedding } = require("./embedding.service");

/**
 * Cosine Similarity Function
 */
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  return dotProduct / (normA * normB);
};

/**
 * Retrieve Top K Similar Chunks
 */
const retrieveRelevantChunks = async (question, topK = 5) => {
  try {
    // 1️⃣ Generate embedding for user question
    const questionEmbedding = await generateEmbedding(question);

    // 2️⃣ Get all stored vectors
    const vectors = await Vector.find();

    // 3️⃣ Calculate similarity score
    const scoredVectors = vectors.map((item) => {
      const score = cosineSimilarity(
        questionEmbedding,
        item.embedding
      );

      return {
        text: item.text,
        score,
      };
    });

    // 4️⃣ Sort by similarity
    scoredVectors.sort((a, b) => b.score - a.score);

    // 5️⃣ Return top K
    return scoredVectors.slice(0, topK);
  } catch (error) {
    console.error("Retrieval Error:", error.message);
    throw {
      status: 500,
      message: "Failed to retrieve relevant chunks",
    };
  }
};

module.exports = {
  retrieveRelevantChunks,
};
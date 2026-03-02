const { pipeline } = require("@xenova/transformers");

let embedder;

const loadModel = async () => {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
};

const generateEmbedding = async (text) => {
  try {
    await loadModel();

    const output = await embedder(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  } catch (error) {
    console.error("Local Embedding Error:", error);
    throw {
      status: 500,
      message: "Failed to generate local embedding",
    };
  }
};

const generateEmbeddingsForChunks = async (chunks) => {
  const embeddings = [];

  for (let chunk of chunks) {
    const embedding = await generateEmbedding(chunk.text);

    embeddings.push({
      text: chunk.text,
      embedding,
    });
  }

  return embeddings;
};

module.exports = {
  generateEmbedding,
  generateEmbeddingsForChunks,
};
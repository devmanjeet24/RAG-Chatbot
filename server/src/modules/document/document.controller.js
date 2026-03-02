const documentService = require("./document.service");
const chunkText = require("../../utils/chunkText");
const { generateEmbeddingsForChunks } = require("../rag/embedding.service");
const Vector = require("../rag/vector.model");

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      throw { status: 400, message: "No file uploaded" };
    }

    const filePath = req.file.path;

    // 1️⃣ Extract text
    const extractedText =
      await documentService.extractTextFromFile(filePath);

    if (!extractedText || extractedText.trim().length === 0) {
      throw { status: 400, message: "No text found in document" };
    }

    // 2️⃣ Chunking
    const chunksArray = chunkText(extractedText, 500, 100);

    const formattedChunks = chunksArray.map((chunk) => ({
      text: chunk,
    }));

    // 3️⃣ Save Document First
    const document = await documentService.createDocument({
      title: req.file.originalname,
      fileName: req.file.filename,
      content: extractedText,
      chunks: formattedChunks,
      uploadedBy: req.user.id,
    });

    // 4️⃣ Generate Embeddings for Chunks
    const embeddings = await generateEmbeddingsForChunks(formattedChunks);

    // 5️⃣ Store Embeddings in Vector Collection
    const vectorData = embeddings.map((item) => ({
      documentId: document._id,
      text: item.text,
      embedding: item.embedding,
    }));

    await Vector.insertMany(vectorData);

    res.status(201).json({
      success: true,
      message: "Document uploaded, chunked, and embedded successfully",
      data: {
        documentId: document._id,
        totalChunks: formattedChunks.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
};
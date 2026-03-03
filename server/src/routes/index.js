const express = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const documentRoutes = require("../modules/document/document.routes");
const ragRoutes = require("../modules/rag/rag.routes");
const chatRoutes = require("../modules/chat/chat.routes");
const conversationRoutes = require("../modules/conversation/conversation.routes");
const messageRoutes = require("../modules/message/message.routes");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/conversations", authMiddleware, conversationRoutes);
router.use("/documents", authMiddleware, documentRoutes);
router.use("/messages", authMiddleware, messageRoutes);
router.use("/rag", authMiddleware, ragRoutes);
router.use("/chat", authMiddleware, chatRoutes);

module.exports = router;
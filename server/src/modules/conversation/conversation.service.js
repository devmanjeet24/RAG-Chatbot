const Conversation = require("./conversation.model");

const createConversation = async (userId) => {
  return await Conversation.create({ userId });
};

const getUserConversations = async (userId) => {
  return await Conversation.find({ userId })
    .sort({ updatedAt: -1 })
    .lean();
};

const deleteConversation = async (conversationId, userId) => {
  return await Conversation.findOneAndDelete({
    _id: conversationId,
    userId,
  });
};

// 🔥 NEW FUNCTION
const updateConversationTitle = async (conversationId, title) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    { title },
    { new: true }
  );
};

module.exports = {
  createConversation,
  getUserConversations,
  deleteConversation,
  updateConversationTitle,
};
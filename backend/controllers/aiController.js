const { chatWithAI } = require('../utils/aiService');

/**
 * Handle general AI chat requests
 * @route POST /api/ai/chat
 * @access Private
 */
const handleAIChat = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: 'Messages are required and must be an array' });
        }

        const response = await chatWithAI(messages);
        res.json({ response });

    } catch (error) {
        console.error('AI Chat Controller Error:', error);
        res.status(500).json({ message: 'Failed to get AI response' });
    }
};

module.exports = { handleAIChat };

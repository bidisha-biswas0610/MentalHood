const express = require("express");
const Chat = require("../models/chat");
const router = express.Router();

// Save chat message
router.post("/chat", async (req, res) => {
    const { sender, content } = req.body;

    if (!content) {
        return res.status(400).json({ error: "Message content is required" });
    }

    try {
        let chat = await Chat.findOne(); // Retrieve the first chat document
        if (!chat) {
            chat = new Chat({ messages: [] }); // Create a new one if not found
        }

        chat.messages.push({ sender, content });
        await chat.save();

        res.json({ message: "Chat saved successfully!" });
    } catch (error) {
        console.error("Error saving chat:", error);
        res.status(500).json({ error: "Failed to save message" });
    }
});

// Retrieve chat history
router.get("/chat", async (req, res) => {
    try {
        const chat = await Chat.findOne(); // Get chat messages
        res.json(chat ? chat.messages : []);
    } catch (error) {
        console.error("Error retrieving chat history:", error);
        res.status(500).json({ error: "Failed to load chat history" });
    }
});

module.exports = router;

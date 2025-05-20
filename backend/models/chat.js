const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  messages: [
    {
      sender: { type: String, required: true }, // "user" or "bot"
      content: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("Chat", chatSchema);

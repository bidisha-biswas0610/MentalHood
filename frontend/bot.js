document.addEventListener("DOMContentLoaded", function () {
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const chatMessages = document.getElementById("chat-messages");

  const API_URL = "http://localhost:5006/auth/chat"; // Updated backend API URL

  function sendMessage() {
    const message = userInput.value.trim();
    const username = localStorage.getItem("username") || "guest";

    if (!message) return;

    appendMessage("user", message);
    userInput.value = "";

    fetch('https://60e1-34-16-161-203.ngrok-free.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    })
    .then(res => res.json())
    .then(data => {
        appendMessage("bot", data.response);  // <- Bot reply
    })
    .catch(error => console.error("Error:", error));
}

  function appendMessage(sender, message) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", sender);
      messageDiv.textContent = message;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleKeyPress(event) {
      if (event.key === "Enter") sendMessage();
  }

  sendButton.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", handleKeyPress);
});




 
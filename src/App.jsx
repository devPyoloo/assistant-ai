import { useState } from "react";
import axios from "axios";

function App() {
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello, I’m your AI assistant! How can I help you?",
    },
  ]);

  const handleOnSend = async () => {
    if (!userInput.trim()) return; // Prevent empty input submission

    const newMessages = [...messages, { role: "user", text: userInput }];

    setMessages(newMessages);
    setIsTyping(true);
    setUserInput("");

    await processMessageToAI(newMessages);
  };

  async function processMessageToAI(chatMessages) {
    chatMessages = chatMessages.map(({role, text}) => ({role, parts: [{ text }]}));

    console.log(chatMessages);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL,
        {
          contents: chatMessages,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse =
        response.data.candidates?.[0]?.content.parts[0].text || "No response from AI.";

        console.log(response.data);
        

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", text: aiResponse },
      ]);

      setIsTyping(false);
    } catch (error) {
      console.error("Error processing message", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", text: "Failed to get a response from the AI." },
      ]);
      setIsTyping(false);
    }
  }

  return (
    <div>
      <h2>Start Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.role}:</strong> {msg.text}
          </p>
        ))}

        {isTyping && <p>AI is typing...</p>}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask me something"
        onKeyDown={(e) => e.key === "Enter" && handleOnSend()}
      />
      <button onClick={handleOnSend} disabled={isTyping}>
        {isTyping ? "Typing..." : "Send"}
      </button>
    </div>
  );
}

export default App;

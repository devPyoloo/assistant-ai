import { useState } from "react";
import axios from "axios";
import "./index.css";
import aiICon from "./assets/ai.png";
import { BsFillSendFill } from "react-icons/bs";

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

    const newMessages = [
      ...messages,
      { role: "user", text: userInput, directions: "outgoing" },
    ];

    setMessages(newMessages);
    setIsTyping(true);
    setUserInput("");

    await processMessageToAI(newMessages);
  };

  async function processMessageToAI(chatMessages) {
    chatMessages = chatMessages.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

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
        response.data.candidates?.[0]?.content.parts[0].text ||
        "No response from AI.";

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
    <main className="flex justify-center items-center h-screen w-screen m-auto">
      <div className="relative w-9/12 bg-mutedBlack px-10 py-10 text-white">
        <header className="absolute right-0 left-0 top-0 py-2 px-1 flex justify-start items-center font-jockey font-bold text-2xl bg-offBlack">
          <img className="w-12" src={aiICon} alt="AI Profile" /> YOUR AI PARTNER
        </header>
        <div className="overflow-y-auto max-h-40 p-2">
          {messages.map((msg, index) => (
            <section
              className={`flex items-center ${
                msg.role === "user" ? "justify-end" : ""
              }`}
              key={index}
            >
              <span
                className={`px-3 flex ${
                  msg.role === "model" ? "bg-offBlack" : "bg-lightBlack"
                }`}
              >
                {msg.role === "model" ? (
                  <img className="w-5" src={aiICon} alt="AI Profile" />
                ) : (
                  ""
                )} {msg.text}
              </span>
            </section>
          ))}

          {isTyping && <p>AI is typing...</p>}
        </div>
        {isTyping && "Typing..."}

        <div className="absolute right-0 left-0 bottom-0 flex w-full mt-10 border-t-2 border-t-gray-100 pt-5">
          <input
            className="text-gray-100 px-2 bg-offBlack w-full"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask me something"
            onKeyDown={(e) => e.key === "Enter" && handleOnSend()}
          />
          <button className="" onClick={handleOnSend} disabled={isTyping}>
            <BsFillSendFill className="text-white" />
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;

import { useEffect, useState } from "preact/hooks";
import "./app.css";

import { CreateMLCEngine } from "@mlc-ai/web-llm";

const initProgressCallback = (initProgress) => {
  console.log(initProgress);
};
const selectedModel = "Llama-3.2-3B-Instruct-q4f32_1-MLC";

let engine;

async function initializeEngine() {
  engine = await CreateMLCEngine(selectedModel, {
    initProgressCallback: initProgressCallback,
  });
}

initializeEngine();

export function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "Comportate como un asistente experto en Programación." },
  ]);

  useEffect(() => {
    if (engine) {
      callLLM("Explain the meaning of life as a pirate!");
    }
  }, []);

  const callLLM = async (userMessage) => {
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);

    try {
      const reply = await engine.chat.completions.create({
        messages: newMessages,
      });
      const aiReply = reply.choices[0].message.content;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: aiReply },
      ]);
    } catch (error) {
      console.error("Error interacting with the model:", error);
    }
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      callLLM(input);
      setInput("");
    }
  };

  return (
    <div class="chat-app">
      <div class="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <div class="message-content">
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div class="chat-input-container">
        <input
          type="text"
          value={input}
          onInput={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          class="chat-input"
        />
        <button onClick={handleSendMessage} class="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

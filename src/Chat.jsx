import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Chat.module.css";
// import negativo from "../src/imgs/negativo.jpg";
// import positivo from "../src/imgs/positivo.jpg";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [startDate, setStartDate] = useState("");

  // função para formatar a hora
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // função para formatar a hora
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const startChat = async () => {
      const today = new Date();
      setStartDate(formatDate(today)); // define a data inicial da conversa
      const response = await axios.get("/api/chat/start");
      const initialMessage = response.data;
      // adiciona a hora na mensagem inicial
      initialMessage.timestamp = new Date();
      setMessages([initialMessage]);
      setOptions(initialMessage.options);
    };
    startChat();
  }, []);

  const sendMessage = async (message) => {
    const userMessage = {
      content: message,
      type: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const response = await axios.post("/api/chat", userMessage);
    const botMessage = { ...response.data, timestamp: new Date() };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setOptions(botMessage.options);
  };

  const sendMenu = async () => {
    await axios.get("/send-email");
  }

  return (
    <>
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {startDate && (
            <div className={styles.startDate}>
              <p style={{ textAlign: "center", color: "#888" }}>{startDate}</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.type === "user" ? styles.userMessage : styles.botMessage
              }
            >
              <p>{msg.content}</p>

              {msg.timestamp && (
                <span className={styles.timestamp}>
                  {formatTime(new Date(msg.timestamp))}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className={styles.optionsContainer}>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => sendMessage(option)}
              className={styles.optionButton}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => sendMenu()}>Salvar cardápio</button>
    </>
  );
}

export default Chat;

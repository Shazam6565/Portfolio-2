import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ChatbotContainer = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  width: 100%;
  max-width: 600px; /* Adjust the width here */
  margin-top: 50px;
  border-radius: 20px; /* Curved edges for the entire container */
  background-color: var(--navy);

  .chat-window {
    width: 100%;
    height: 400px; /* Increased height for better usability */
    border: 1px solid var(--light-slate);
    border-radius: 20px; /* Curved edges for the chat window */
    padding: 20px;
    overflow-y: auto;
    background-color: var(--light-navy);
  }

  .message {
    margin-bottom: 10px;
  }

  .user {
    color: var(--green);
  }

  .bot {
    color: var(--slate);
  }

  .input-container {
    width: 100%;
    display: flex;
    margin-top: 10px;
    border-radius: 20px; /* Curved edges for the input container */
    background-color: var(--navy);
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    input {
      width: 100%;
      padding: 10px;
      border-radius: 20px; /* Curved edges for the input field */
      border: 1px solid var(--light-slate);
      outline: none;
    }

    button {
      margin-left: 10px;
      padding: 10px 20px;
      border-radius: 20px; /* Curved edges for the button */
      border: none;
      background-color: var(--green);
      color: white;
      cursor: pointer;
      ${({ theme }) => theme.mixins.smallButton};
    }
  }
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:1234/v1/chat/completions', {
        model: 'TheBloke/Mistral-7B-Instruct-v0.1-GGUF',
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...updatedMessages
        ],
        temperature: 0.7,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer lm-studio`
        }
      });

      const botMessage = { role: 'bot', content: response.data.choices[0].message.content };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching the chatbot response:', error);
      const errorMessage = { role: 'bot', content: 'Sorry, something went wrong.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  return (
    <ChatbotContainer>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </ChatbotContainer>
  );
};

export default Chatbot;

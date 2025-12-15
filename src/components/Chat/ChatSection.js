import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const StyledChatSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  max-width: 700px;
  margin: 0 auto 100px;
  padding: 0 20px;

  h2 {
    font-size: clamp(24px, 5vw, 32px);
    margin-bottom: 30px;
    color: var(--lightest-slate);
    text-align: center;

    .green {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-md);
      display: block;
      margin-bottom: 10px;
    }
  }
`;

const ChatContainer = styled.div`
  width: 100%;
  height: 500px;
  background-color: rgba(17, 34, 64, 0.7); /* Light Navy with opacity */
  backdrop-filter: blur(10px);
  border: 1px solid var(--green);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px -15px var(--navy-shadow);
  overflow: hidden;
`;

const MessagesWindow = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--dark-slate);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: var(--navy);
  }
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: var(--fz-sm);
  line-height: 1.5;

  /* User Styling */
  &.user {
    align_self: flex-end;
    background-color: rgba(100, 255, 218, 0.1); /* Green tint */
    border: 1px solid var(--green);
    color: var(--green);
    border-bottom-right-radius: 2px;
  }

  /* Bot Styling */
  &.bot {
    align_self: flex-start;
    background-color: var(--light-navy);
    border: 1px solid var(--light-slate);
    color: var(--lightest-slate);
    border-bottom-left-radius: 2px;
  }

  /* Typing Indicator */
  &.typing {
    font-style: italic;
    color: var(--slate);
    background: transparent;
    border: none;
    padding: 0;
  }
`;

const InputArea = styled.form`
  display: flex;
  gap: 10px;
  padding: 15px;
  background-color: var(--navy);
  border-top: 1px solid var(--light-navy);

  input {
    flex: 1;
    background-color: var(--light-navy);
    border: 1px solid var(--light-slate);
    border-radius: 4px;
    padding: 10px 15px;
    color: var(--lightest-slate);
    font-family: var(--font-sans);
    font-size: var(--fz-sm);

    &:focus {
      outline: none;
      border-color: var(--green);
    }

    &::placeholder {
      color: var(--slate);
    }
  }

  button {
    ${({ theme }) => theme.mixins.smallButton};
    padding: 10px 20px;
  }
`;

const ChatSection = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content:
        'Hello! I\'m Shaurya\'s AI assistant. Ask me anything about his experience, skills, or projects.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async e => {
    e.preventDefault();
    if (!input.trim() || loading) {
      return;
    }

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Connect to Backend API
      const API_URL = 'https://shaurya-chat-endpoint.onrender.com/chat';

      const response = await axios.post(API_URL, {
        message: userMsg.content,
      });

      const botMsg = { role: 'bot', content: response.data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: 'Sorry, I\'m having trouble connecting to the brain right now.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledChatSection id="chat">
      <h2>
        <span className="green">AI</span>
        What do you wish to know about me?
      </h2>

      <ChatContainer>
        <MessagesWindow>
          {messages.map((msg, i) => (
            <MessageBubble key={i} className={msg.role}>
              {msg.content}
            </MessageBubble>
          ))}
          {loading && <MessageBubble className="typing">Thinking...</MessageBubble>}
          <div ref={messagesEndRef} />
        </MessagesWindow>

        <InputArea onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about my Python experience..."
          />
          <button type="submit" disabled={loading}>
            Send
          </button>
        </InputArea>
      </ChatContainer>
    </StyledChatSection>
  );
};

export default ChatSection;

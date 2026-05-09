import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const dotPulse = keyframes`
  0% { opacity: 0.5; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.5; transform: scale(0.8); }
`;

const StyledChatSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  width: 75vw;
  max-width: 1400px;
  margin: 0 auto 100px;
  padding: 0 20px;
  position: relative;
  min-height: 50vh;

  header {
    width: 100%;
    margin-bottom: 30px;
    position: relative;
    text-align: center;

    /* AI Label positioned absolutely top-right of the header area, or inline if preferred minimal */
    .ai-label {
      position: absolute;
      top: -20px;
      right: 0;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--green);
      opacity: 0.6;
      border: 1px solid var(--green);
      padding: 2px 8px;
      border-radius: 4px;

      @media (max-width: 480px) {
        position: static;
        display: inline-block;
        margin-bottom: 15px;
      }
    }

    h2 {
      font-family: var(--font-sans);
      font-size: clamp(32px, 5vw, 42px);
      font-weight: 600;
      color: var(--lightest-slate);
      line-height: 1.1;
      margin: 0;
    }
  }
`;

const ChatContainer = styled.div`
  width: 100%;
  height: 75vh;
  background-color: rgba(17, 34, 64, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;

  /* Subtle Pattern Overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(var(--slate) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }
`;

const MessagesWindow = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--dark-slate);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const MessageBubble = styled.div`
  max-width: 85%;
  padding: 14px 18px;
  border-radius: 18px;
  font-size: var(--fz-md);
  line-height: 1.6;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;

  /* User Styling */
  ${props =>
    props.messageType === 'user' &&
    css`
      align-self: flex-end;
      background-color: var(--green);
      color: var(--navy);
      border-bottom-right-radius: 4px;

      p {
        margin: 0;
      }
    `}

  /* Bot Styling */
  ${props =>
    props.messageType === 'bot' &&
    css`
      align-self: flex-start;
      background-color: var(--light-navy);
      color: var(--lightest-slate);
      border-bottom-left-radius: 4px;
      border: 1px solid var(--light-slate);

      /* Markdown Styles */
      p {
        margin: 0 0 10px 0;
        &:last-child {
          margin-bottom: 0;
        }
      }
      ul,
      ol {
        margin: 0 0 10px 20px;
        padding: 0;
      }
      li {
        margin-bottom: 5px;
      }
      strong {
        color: var(--green);
        font-weight: 600;
      }
      a {
        color: var(--green);
        text-decoration: underline;
        &:hover {
          text-decoration: none;
        }
      }
      h1,
      h2,
      h3,
      h4 {
        margin: 15px 0 10px;
        font-size: 1.1em;
        color: var(--white);
      }
    `}

  /* Typing Indicator Special Styling */
  ${props =>
    props.messageType === 'typing' &&
    css`
      align-self: flex-start;
      background-color: transparent;
      border: none;
      box-shadow: none;
      padding: 0;
      margin-left: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    `}
`;

const TypingDot = styled.span`
  width: 8px;
  height: 8px;
  background-color: var(--slate);
  border-radius: 50%;
  display: inline-block;
  animation: ${dotPulse} 1.4s infinite ease-in-out both;
  animation-delay: ${props => props.delay || '0s'};
`;

const InputArea = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 15px;
  padding: 20px 30px;
  background-color: rgba(10, 25, 47, 0.8);
  position: relative;
  z-index: 2;

  input {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px 0;
    color: var(--lightest-slate);
    font-family: var(--font-sans);
    font-size: var(--fz-md);
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-bottom: 1px solid var(--green);
      box-shadow: 0 1px 0 0 var(--green);
    }

    &::placeholder {
      color: var(--slate);
      opacity: 0.7;
    }
  }
`;

const SendButton = styled.button`
  background-color: var(--green);
  color: var(--navy);
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 10px rgba(100, 255, 218, 0.2);

  &:hover {
    transform: scale(1.05);
    background-color: var(--green);
    box-shadow: 0 6px 15px rgba(100, 255, 218, 0.3);
  }
  &:disabled {
    background-color: var(--slate);
    cursor: default;
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
    margin-left: 2px; /* Visual balance for arrow */
  }
`;

const ChatSection = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content:
        'Hello, I\'m Shaurya\'s assistant. Ask me anything about him or his career to know him better.',
      isGreeting: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  // Check if it's the initial mount to prevent auto-scrolling the entire page
  const isFirstRender = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    // Skip scrolling on initial render to avoid page jump
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToBottom();
  }, [messages, loading]);

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
      const API_URL =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8001/chat'
          : 'https://shaurya-chat-endpoint.onrender.com/chat';

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
      <header>
        <span className="ai-label">AI ASSISTANT</span>
        <h2>Ask me anything</h2>
      </header>

      <ChatContainer>
        <MessagesWindow>
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              messageType={msg.role}
              style={msg.isGreeting ? { opacity: 0.8 } : {}}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </MessageBubble>
          ))}

          {loading && (
            <MessageBubble messageType="typing">
              <TypingDot delay="0s" />
              <TypingDot delay="0.2s" />
              <TypingDot delay="0.4s" />
            </MessageBubble>
          )}

          <div ref={messagesEndRef} />
        </MessagesWindow>

        <InputArea onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything..."
          />
          <SendButton type="submit" disabled={loading} aria-label="Send Message">
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </SendButton>
        </InputArea>
      </ChatContainer>
    </StyledChatSection>
  );
};

export default ChatSection;

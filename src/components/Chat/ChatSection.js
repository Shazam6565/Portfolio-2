import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const StyledChatSection = styled.section`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;

  header {
    width: 100%;
    margin-bottom: 24px;

    .ai-label {
      display: block;
      margin-bottom: 8px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    h1 {
      margin: 0;
      font-size: var(--fz-heading);
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1.1;
      color: var(--text);
    }
  }
`;

const ChatContainer = styled.div`
  width: 100%;
  height: 65vh;
  min-height: 360px;
  background-color: var(--bg);
  border: 1px solid var(--line);
  border-radius: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MessagesWindow = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--line);
    border-radius: 0;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const MessageBubble = styled.div`
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 0;
  font-size: var(--fz-sm);
  line-height: 1.5;
  animation: ${fadeIn} 0.2s ease both;

  /* User Styling */
  ${props =>
    props.messageType === 'user' &&
    css`
      align-self: flex-end;
      background-color: var(--text);
      color: var(--bg);

      p {
        margin: 0;
      }
      a {
        color: inherit;
        text-decoration: underline;
        text-underline-offset: 3px;
      }
    `}

  /* Bot Styling */
  ${props =>
    props.messageType === 'bot' &&
    css`
      align-self: flex-start;
      background-color: var(--surface);
      color: var(--text-secondary);

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
        color: var(--text);
        font-weight: 600;
      }
      a {
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-color: var(--line);

        &:hover {
          text-decoration-color: var(--text);
        }
      }
      h1,
      h2,
      h3,
      h4 {
        margin: 15px 0 10px;
        font-size: 1.1em;
        font-weight: 600;
        color: var(--text);
      }
      code {
        font-family: var(--font-mono);
        font-size: 0.85em;
        background-color: #ececec;
        border: 1px solid var(--line);
        padding: 0.1em 0.4em;
        color: var(--text);
      }
      pre {
        margin: 0 0 10px 0;
        padding: 10px 12px;
        background-color: var(--bg);
        border: 1px solid var(--line);
        overflow-x: auto;

        code {
          background-color: transparent;
          border: none;
          padding: 0;
        }
      }
    `}

  /* Typing Indicator */
  ${props =>
    props.messageType === 'typing' &&
    css`
      align-self: flex-start;
      background-color: transparent;
      padding: 0 2px;
      font-family: var(--font-mono);
      letter-spacing: 2px;
      color: var(--text-muted);
    `}
`;

const InputArea = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background-color: var(--bg);
  border-top: 1px solid var(--line);

  input {
    flex: 1;
    background: none;
    border: none;
    padding: 8px 0;
    color: var(--text);
    font-family: var(--font-sans);
    font-size: var(--fz-sm);

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: var(--text-muted);
    }
  }
`;

const SendButton = styled.button`
  ${({ theme }) => theme.mixins.smallButton};
  flex-shrink: 0;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: default;

    &:hover,
    &:focus-visible {
      background-color: transparent;
      color: var(--text);
    }
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
        <span className="ai-label">AI Assistant</span>
        <h1>Ask me anything</h1>
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

          {loading && <MessageBubble messageType="typing">…</MessageBubble>}

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
            Send
          </SendButton>
        </InputArea>
      </ChatContainer>
    </StyledChatSection>
  );
};

export default ChatSection;

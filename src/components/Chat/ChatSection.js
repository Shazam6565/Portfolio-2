import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const Wrap = styled.section`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 22px;

  .label {
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
`;

const Terminal = styled.div`
  width: 100%;
  height: 66vh;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--text);
  background: var(--bg);
  font-family: var(--font-mono);
  cursor: text;

  /* ---- title bar ---- */
  .bar {
    flex: none;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--line);
  }
  .dots {
    display: flex;
    gap: 7px;
  }
  .dots i {
    width: 9px;
    height: 9px;
    border: 1px solid var(--text-muted);
    border-radius: 50%;
  }
  .title {
    font-size: var(--fz-xs);
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }

  /* ---- output ---- */
  .body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 16px 10px;
    font-size: var(--fz-sm);
    line-height: 1.65;
    color: var(--text);
    display: flex;
    flex-direction: column;
    gap: 12px;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--line);
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }

  .line {
    word-break: break-word;
  }
  .line.user {
    display: flex;
    gap: 10px;
    color: var(--text);
  }
  .line.user .cmd {
    white-space: pre-wrap;
  }
  .prompt {
    color: var(--text-muted);
    user-select: none;
  }

  .line.bot {
    color: var(--text-secondary);
  }
  .line.bot.greeting {
    color: var(--text-muted);
  }
  .line.bot p {
    margin: 0 0 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .line.bot ul,
  .line.bot ol {
    margin: 4px 0 8px;
    padding-left: 18px;
  }
  .line.bot li {
    margin-bottom: 4px;
  }
  .line.bot strong {
    color: var(--text);
    font-weight: 600;
  }
  .line.bot a {
    color: var(--text);
    text-decoration: underline;
    text-decoration-color: var(--line);
    text-underline-offset: 3px;
    &:hover,
    &:focus-visible {
      text-decoration-color: var(--text);
    }
  }
  .line.bot code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background-color: var(--surface);
    border: 1px solid var(--line);
    padding: 0.05em 0.35em;
  }
  .line.bot pre {
    margin: 0 0 8px;
    padding: 10px 12px;
    background-color: var(--surface);
    border: 1px solid var(--line);
    overflow-x: auto;

    code {
      background: transparent;
      border: 0;
      padding: 0;
    }
  }

  .cursor {
    display: inline-block;
    width: 8px;
    height: 1.05em;
    background-color: var(--text);
    vertical-align: text-bottom;
    animation: ${blink} 1s steps(1) infinite;
  }

  /* ---- prompt line ---- */
  .input {
    flex: none;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-top: 1px solid var(--line);
  }
  .input input {
    flex: 1;
    background: none;
    border: 0;
    outline: none;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    caret-color: var(--text);

    &::placeholder {
      color: var(--text-muted);
    }
  }
`;

const ChatSection = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content:
        'Hi, I\'m Shaurya\'s portfolio assistant. Ask me about his production AI work, agentic systems, projects, his move into Physical AI, or how he\'d approach a technical problem.',
      isGreeting: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // Check if it's the initial mount to prevent auto-scrolling the entire page
  const isFirstRender = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
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

    // Recent turns for context (mapped to the API's role names).
    const history = messages
      .filter(m => m.role === 'user' || m.role === 'bot')
      .slice(-8)
      .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Netlify serverless function (free) — see netlify/functions/chat.mjs.
      // It streams the reply back as plain text, token by token.
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history }),
      });

      if (!response.body) {
        throw new Error('No response stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      let started = false;

      for (;;) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        acc += decoder.decode(value, { stream: true });

        if (!started) {
          // First chunk arrived: drop the cursor and add the output line.
          started = true;
          setLoading(false);
          setMessages(prev => [...prev, { role: 'bot', content: acc }]);
        } else {
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { role: 'bot', content: acc };
            return next;
          });
        }
      }

      if (!started) {
        setMessages(prev => [
          ...prev,
          { role: 'bot', content: 'Sorry, I didn\'t catch that — please try again.' },
        ]);
      }
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
    <Wrap id="chat">
      <Header>
        <span className="label">AI Assistant</span>
        <h1>Ask about my work</h1>
      </Header>

      <Terminal onClick={() => inputRef.current?.focus()}>
        <div className="bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          <span className="title">visitor@shaurya — ~/assistant</span>
        </div>

        <div className="body">
          {messages.map((msg, i) =>
            msg.role === 'user' ? (
              <div className="line user" key={i}>
                <span className="prompt">❯</span>
                <span className="cmd">{msg.content}</span>
              </div>
            ) : (
              <div className={`line bot${msg.isGreeting ? ' greeting' : ''}`} key={i}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ),
          )}

          {loading && (
            <div className="line bot">
              <span className="cursor" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="input" onSubmit={handleSend}>
          <span className="prompt">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="type a question…"
            aria-label="Ask the assistant"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </Terminal>
    </Wrap>
  );
};

export default ChatSection;

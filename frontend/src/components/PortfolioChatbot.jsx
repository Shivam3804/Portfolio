import { useEffect, useRef, useState } from "react";

export default function PortfolioChatbot() {

  const [open, setOpen] =
    useState(false);

  const [online, setOnline] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const chatRef = useRef(null);

  /* Ping on startup */

  useEffect(() => {

    const checkPing = async () => {

      try {

        const res = await fetch(
          "http://127.0.0.1:8000/my-portfolio/api/v0/ping"
        );

        const data = await res.json();
        
        console.log(data)
        setOnline(data?.ping === true);

      } catch {

        setOnline(false);

      }
    };

    checkPing();

  }, []);

  /* Close on outside click */

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        chatRef.current &&
        !chatRef.current.contains(e.target)
      ) {

        setOpen(false);

      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  /* Send */

  const sendMessage = async () => {

    if (!query.trim()) return;

    const userMessage = {
      role: "user",
      text: query,
    };

    setMessages(prev => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/my-portfolio/api/v0/chatbot/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            query,
          }),
        }
      );

      const data = await res.json();

      console.log(data)

      if (data?.ping === false) {

        setMessages(prev => [
          ...prev,
          {
            role: "bot",
            text:
              "Chatbot is currently offline.",
          },
        ]);

      } else {

        setMessages(prev => [
          ...prev,
          {
            role: "bot",
            text: data?.text,
            links: data?.links || [],
          },
        ]);

      }

    } catch {

      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text:
            "Unable to connect to chatbot.",
        },
      ]);

    }

    setLoading(false);

    setQuery("");

  };

  return (

    <div className="portfolio-chatbot">

      {/* Toggle */}

      <button
        className={`chatbot-toggle ${
          online
            ? "online"
            : "offline"
        }`}
        onClick={() => {

          if (online) {

            setOpen(prev => !prev);

          }
        }}
      >

        <span className="chatbot-dot" />

        {online
          ? "Portfolio AI"
          : "AI Offline"}

      </button>

      {/* Chat Window */}

      {open && (

        <div
          className="chatbot-window"
          ref={chatRef}
        >

          <div className="chatbot-header">

            <div>

              <h3>
                Shivam AI Assistant
              </h3>

              <span>
                Ask about projects,
                skills, experience...
              </span>

            </div>

          </div>

          <div className="chatbot-messages">

            {messages.length === 0 && (

              <div className="chatbot-empty">

                Ask something about
                the portfolio.

              </div>

            )}

            {messages.map((msg, i) => (

              <div
                key={i}
                className={`chat-msg ${msg.role}`}
              >

                <p>{msg.text}</p>

                {msg.links?.length > 0 && (

                  <div className="chat-links">

                    {msg.links.map(
                      (link, idx) => (

                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source ↗
                        </a>

                      )
                    )}

                  </div>

                )}

              </div>

            ))}

          </div>

          <div className="chatbot-input">

            <input
              type="text"
              value={query}
              placeholder="Ask something..."
              onChange={(e) =>
                setQuery(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  sendMessage();

                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
            >
              {loading
                ? "..."
                : "Send"}
            </button>

          </div>

        </div>

      )}

    </div>
  );
}
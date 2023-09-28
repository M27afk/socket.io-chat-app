import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SignOutButton, useAuth } from "@clerk/clerk-react";

export default function Home({ socket }) {
  const [value, setValue] = useState([]);

  const { isLoaded, userId } = useAuth();
  const [write, setWrite] = useState(false);
  const writeFunction = () => setWrite(true);
  const lastMessageRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const handleSubmit = () => {
    console.log(value);
    socket.emit("message", {
      value,
      userId: userId.slice(0, 10),
    });
    setWrite(false);
  };

  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setMessages([...messages, data]);
      if (!onlineUsers.includes(data.userId)) {
        setOnlineUsers([...onlineUsers, data.userId]);
      }
    });
  }, [socket, messages, onlineUsers]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="logo">
          Socket.io Chat App
        </Link>
        <SignOutButton signOutCallback={() => console.log("Signed out!")}>
          <button className="signOutBtn">Sign out</button>
        </SignOutButton>
      </nav>

      {!write ? (
        <main className="chat">
          <div className="chat__body">
            <div className="chat__content">
              {messages.map((message, index) =>
                message.userId === userId.slice(0, 10) ? (
                  <div style={{ float: "right", margin: "7px 0" }} key={index}>
                    <p style={{ textAlign: "right", fontSize: "13px" }}>
                      {message.userId}
                    </p>
                    <div className="sender__message">{message.value}</div>
                  </div>
                ) : (
                  <div style={{ margin: "7px 0" }} key={index}>
                    <p style={{ fontSize: "13px" }}>{message.userId}</p>
                    <div className="recipient__message">{message.value}</div>
                  </div>
                )
              )}
              <div ref={lastMessageRef} />
            </div>
            <div className="chat__input">
              <div className="chat__form">
                <button className="createBtn" onClick={writeFunction}>
                  Write message
                </button>
              </div>
            </div>
          </div>
          <aside className="chat__bar">
            <h3>Active users</h3>
            <ul>
              {onlineUsers.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          </aside>
        </main>
      ) : (
        <main className="editor">
          <header className="editor__header">
            <button className=" editorBtn" onClick={handleSubmit}>
              SEND MESSAGE
            </button>
          </header>

          <div className="editor__container">
            <input
              type="text"
              onChange={(e) => {
                setValue(e.target.value);
              }}
              style={{
                border: "1px solid black",
                height: "100px",
                // padding: "10px 20px",
              }}
            />
          </div>
        </main>
      )}
    </div>
  );
}

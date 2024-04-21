import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { TbSend } from "react-icons/tb";
import socketIOClient from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHandPointLeft } from "react-icons/fa";

const useSocket = (serverUrl) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = socketIOClient(serverUrl);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl]);

  return socket;
};

const Chat = () => {
  const receiveMessageRef = useRef();
  const chatHistoryRef = useRef();
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const user = useSelector((state) => state.user);
  const socket = useSocket(import.meta.env.VITE_FrontURL);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      if (receiveMessageRef.current) {
        socket.off("receive-message", receiveMessageRef.current);
      }
      if (chatHistoryRef.current) {
        socket.off("chat-history", chatHistoryRef.current);
      }

      receiveMessageRef.current = (message) => {
        if (message && message.room === selectedRoom) {
          displayMessage(message);
        }
      };

      chatHistoryRef.current = (history) => {
        const tenMinutesAgo = Date.now() - 300 * 60 * 1000; //5h messages
        const recentMessages = history.filter(
          (message) => new Date(message.timestamp).getTime() >= tenMinutesAgo
        );
        recentMessages.forEach((message) => displayMessage(message));
      };

      socket.on("receive-message", receiveMessageRef.current);
      socket.on("chat-history", chatHistoryRef.current);
    }

    return () => {
      if (socket) {
        if (receiveMessageRef.current) {
          socket.off("receive-message", receiveMessageRef.current);
        }
        if (chatHistoryRef.current) {
          socket.off("chat-history", chatHistoryRef.current);
        }
      }
    };
  }, [selectedRoom, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("notify", (message) => {
        toast.error(message);
      });

      socket.on("chatnotify", (message) => {
        displayInfo(message);
      });
      socket.on("connect_error", (error) => {
        displayInfo(error.message);
      });

      socket.on("chatban", (message) => {
        displayInfo(message);
        setTimeout(function () {
          hideInfo();
        }, 2000);
      });

      socket.on("onlineUsersCount", (count) => {
        console.log("naliczylem: ", count);
        setOnlineUsersCount(count);
      });

      socket.on("connect", () => {
        socket.off("onlineUsersCount");
        setIsConnected(true);
      });
    }
  }, [socket]);

  const handleRoomClick = (room) => {
    setMessages([]);
    setSelectedRoom(room);
    socket.emit("join-room", room);
  };

  const handleMessageSubmit = (e, room) => {
    e.preventDefault();
    if (user && inputMessage.trim() !== "") {
      const newMessage = {
        text: inputMessage,
        banned: user.chatban,
        user: user.first_name,
        avatar: user.picture,
        timestamp: new Date().toISOString(),
        room: selectedRoom,
      };

      socket.emit("send-message", newMessage, user.id, selectedRoom);

      setInputMessage("");
    } else {
      if (!user) {
        toast.error("Login first!");
      } else {
        toast.error("Not empty!");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit(e);
    }
  };

  const displayMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    const messageContainer =
      document.getElementsByClassName("message-container")[0];
    messageContainer.scrollTop = messageContainer.scrollHeight;
  };

  const displayInfo = (message) => {
    const selectedElement = document.querySelector(".selected");
    if (selectedElement) {
      const anchorTag = selectedElement.querySelector("a");

      const messageSpan = document.createElement("span");
      messageSpan.textContent = message;
      messageSpan.classList.add(
        "font-bold",
        "text-green-500",
        "flex",
        "justify-end"
      );
      anchorTag.appendChild(messageSpan);

      setTimeout(() => {
        messageSpan.remove();
      }, 1000);
    }
  };

  return (
    <div className="flex h-full mt-2 ">
      <div
        className="rooms ml-2 mr-1 bg-gray-700 mt-1 rounded-lg"
        style={{ width: "19%", height: "74.1vh" }}
      >
        <ul className="menu">
          <h2 className="menu-title text-slate-100 font-bold">Pokoje</h2>
          <ul className="roomss text-slate-400 font-bold ">
            {[
              "Ogólny",
              "Pollub",
              "UMCS",
              "KUL",
              "UMED",
              "UP",
              "WSEI",
              "ANS",
              "ANSiM",
              "COLLEGIUM HUMANUM",
            ].map((room) => (
              <li
                key={room}
                onClick={() => handleRoomClick(room)}
                className={selectedRoom === room ? "selected" : ""}
              >
                <a>{room}</a>
              </li>
            ))}
          </ul>
        </ul>
      </div>

      <div className="chat flex flex-col " style={{ width: "80%" }}>
        <div
          className="online-users bg-gray-700 rounded-t-lg"
          style={{ height: "5%" }}
        >
          <p className="text-xs flex justify-center items-center mt-1.5">
            Online Users {onlineUsersCount}
          </p>
        </div>

        <div
          className="message-container bg-gray-800"
          style={{ height: "480px", overflowY: "scroll" }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat ${
                index === 0 ? "chat-start" : ""
              } flex items-center gap-2 ml-3 mb-1`}
            >
              <div className="chat-image avatar shrink-0">
                <div className="w-10 h-10 rounded-full">
                  <img alt="Avatar" src={message.avatar} />
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                <div className="chat-header mr-2">
                  {message.user}
                  <time className="text-xs opacity-50">{message.time}</time>
                </div>
                <div className="chat-bubble">{message.text}</div>
                <div className="chat-footer opacity-50">{message.status}</div>
                <div ref={messagesEndRef} />
              </div>
            </div>
          ))}
        </div>

        <div
          className="forms bg-gray-700 rounded-b-lg flex items-center"
          style={{ height: "10%" }}
        >
          {/*{user && <img src={user.picture} alt="User Avatar" className="h-12 ml-2 rounded-full"/>}*/}
          <form onSubmit={handleMessageSubmit} className="relative w-full mr-4">
            <input
              type="text"
              placeholder={
                !selectedRoom
                  ? "Wybierz pokój"
                  : user
                  ? "Napisz wiadomość..."
                  : "Zaloguj się najpierw!"
              }
              className="input input-bordered ml-2 w-full mr-2"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!user || !selectedRoom}
            />

            <div className="absolute inset-y-0 right-0 flex items-center mr-4">
              <TbSend className="text-xl" />
            </div>
          </form>

          <div>
            <ToastContainer autoClose={1500} position="bottom-right" />
          </div>
        </div>
      </div>

      <div
        className="rooms ml-2 mr-1 bg-gray-700 mt-1 rounded-lg sm: hidden"
        style={{ width: "19%", height: "74.1vh" }}
      ></div>
    </div>
  );
};

export default Chat;

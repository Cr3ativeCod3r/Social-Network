import React, {useState, useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import {TbSend} from "react-icons/tb";
import socketIOClient from 'socket.io-client';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {FaHandPointLeft} from "react-icons/fa";

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

    const user = useSelector((state) => state.user);
    const socket = useSocket('http://localhost:5000');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);


    useEffect(() => {
        if (socket) {
            console.log("io ok!")
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.on("notify", (message) => {
                toast.error(message);
            });

            socket.on("receive-message", (message) => {
                console.log(message)
                if (message)
                    displayMessage(message);
            });

            socket.on("chat-history", (history) => {
                const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
                const recentMessages = history.filter(
                    (message) => new Date(message.timestamp).getTime() >= tenMinutesAgo
                );

                recentMessages.forEach((message) => displayMessage(message));
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

            socket.on("connect", () => {
                setIsConnected(true);
            });
        }
    }, [socket]);

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (user && inputMessage.trim() !== "") {
            const newMessage = {
                text: inputMessage,
                banned: user.chatban,
                user: user.first_name,
                avatar: user.picture,
                timestamp: new Date().toISOString(),
            };
            socket.emit("send-message", newMessage, user.id);

            setInputMessage("");
        } else {
            if (!user) {
                toast.error("Login first!");
            } else {
                toast.error("Not empty!")
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
        const messageContainer = document.getElementsByClassName("message-container")[0];
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    const displayInfo = (message) => {
        setMessages((prevMessages) => [...prevMessages, {info: message}]);
        const messageContainer = document.getElementsByClassName("message-container")[0];
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleRoomClick = (roomName) => {
        setSelectedRoom(roomName);
    };

    return (
        <div className="flex h-full mt-2 ">

            <div className="rooms ml-2 mr-1 bg-gray-700 mt-1 rounded-lg"
                 style={{width: '19%', height: '74.1vh'}}>

                <ul className="menu ">
                    <h2 className="menu-title text-slate-100 font-bold ">Pokoje</h2>
                    <ul className="roomss text-slate-400 font-bold ">
                        <li onClick={() => handleRoomClick("Ogólny")}
                            className={selectedRoom === "Ogólny" ? "selected" : ""}><a>Ogólny</a></li>
                        <li onClick={() => handleRoomClick("Pollub")}
                            className={selectedRoom === "Pollub" ? "selected" : ""}><a>Pollub</a></li>
                        <li onClick={() => handleRoomClick("UMCS")}
                            className={selectedRoom === "UMCS" ? "selected" : ""}><a>UMCS</a></li>
                        <li onClick={() => handleRoomClick("KUL")} className={selectedRoom === "KUL" ? "selected" : ""}>
                            <a>KUL</a></li>
                        <li onClick={() => handleRoomClick("UMED")}
                            className={selectedRoom === "UMED" ? "selected" : ""}><a>UMED</a></li>
                        <li onClick={() => handleRoomClick("UP")} className={selectedRoom === "UP" ? "selected" : ""}>
                            <a>UP</a></li>
                        <li onClick={() => handleRoomClick("WSEI")}
                            className={selectedRoom === "WSEI" ? "selected" : ""}><a>WSEI</a></li>
                        <li onClick={() => handleRoomClick("ANS")} className={selectedRoom === "ANS" ? "selected" : ""}>
                            <a>ANS</a></li>
                        <li onClick={() => handleRoomClick("ANSiM")}
                            className={selectedRoom === "ANSiM" ? "selected" : ""}><a>ANSiM</a></li>
                        <li onClick={() => handleRoomClick("COLLEGIUM HUMANUM")}
                            className={selectedRoom === "COLLEGIUM HUMANUM" ? "selected" : ""}><a>COLLEGIUM HUMANUM</a>
                        </li>
                    </ul>
                </ul>

            </div>

            <div className="chat flex flex-col " style={{width: '80%'}}>

                <div className="online-users bg-gray-700 rounded-t-lg"
                     style={{height: '5%'}}>
                    <p className="text-xs flex justify-center items-center mt-1.5">Online Users 0</p>
                </div>

                <div className="message-container bg-gray-800" style={{height: '480px', overflowY: 'scroll'}}>
                    {messages.map((message, index) => (
                        <div key={index}
                             className={`chat ${index === 0 ? 'chat-start' : ''} flex items-center gap-2 ml-3 mb-1`}>
                            <div className="chat-image avatar shrink-0">
                                <div className="w-10 h-10 rounded-full">
                                    <img alt="Avatar" src={message.avatar}/>
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <div className="chat-header mr-2">
                                    {message.user}
                                    <time className="text-xs opacity-50">{message.time}</time>
                                </div>
                                <div className="chat-bubble">{message.text}</div>
                                <div className="chat-footer opacity-50">{message.status}</div>
                                <div ref={messagesEndRef}/>
                            </div>
                        </div>
                    ))}

                </div>


                <div className="forms bg-gray-700 rounded-b-lg flex items-center"
                     style={{height: '10%'}}>

                    {/*{user && <img src={user.picture} alt="User Avatar" className="h-12 ml-2 rounded-full"/>}*/}
                    <form onSubmit={handleMessageSubmit} className="relative w-full mr-4">
                        <input
                            type="text"
                            placeholder={user ? "Napisz wiadomość..." : "Zaloguj się najpierw!"}
                            className="input input-bordered ml-2 w-full mr-2"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={!user}
                        />

                        <div className="absolute inset-y-0 right-0 flex items-center mr-4">
                            <TbSend className="text-xl"/>
                        </div>
                    </form>

                    <div>
                        <ToastContainer autoClose={1500} position="bottom-right"/>
                    </div>
                </div>
            </div>

            <div className="rooms ml-2 mr-1 bg-gray-700 mt-1 rounded-lg sm: hidden"
                 style={{width: '19%', height: '74.1vh'}}>

            </div>
        </div>
    );

};

export default Chat;

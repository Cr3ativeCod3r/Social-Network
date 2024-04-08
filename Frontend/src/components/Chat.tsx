import React, {useState, useRef, useEffect} from 'react';
import {useSelector} from "react-redux";
import {TbSend} from "react-icons/tb";

const Chat = () => {

    const user = useSelector(state => state.user);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (loggedInUser && inputMessage.trim() !== "") {
            const newMessage = {
                text: inputMessage,
                chatdelay: "false",
                user: loggedInUser,
                timestamp: new Date().toISOString(),
            };
            socket.emit("send-message", newMessage, id, nick);
            setInputMessage("");
        } else {
            if (!loggedInUser) {
                displayInfo("Login first");

                setTimeout(function () {
                    hideInfo();
                }, 1000);
            } else {
                displayInfo("Not empty");
                setTimeout(function () {
                    hideInfo();
                }, 1000);
            }
        }
    };

    return (
        <div className="flex h-screen mt-2 ">

            <div className="rooms ml-2 mr-1 bg-gray-700 mt-1 rounded-lg"
                 style={{width: '19%', height: '74.1vh'}}>
                rooms
            </div>

            <div className="chat flex flex-col " style={{width: '80%'}}>

                <div className="online-users bg-gray-700 rounded-t-lg"
                     style={{height: '5%'}}>
                    Online Users
                </div>

                <div className="message-container bg-gray-800"
                     style={{height: '60%'}}>
                    Messages
                </div>

                <div className="forms bg-gray-700 rounded-b-lg flex items-center" style={{height: '10%'}}>
                    {user && <img src={user.picture} alt="User Avatar" className="h-12 ml-2 rounded-full"/>}
                    <div className="relative w-full mr-4">
                        <input
                            type="text"
                            placeholder="Napisz wiadomość..."
                            className="input input-bordered ml-2 w-full mr-2"

                        />
                        <div className="absolute inset-y-0 right-0 flex items-center mr-4">
                            <TbSend className="text-xl"/>
                        </div>
                    </div>


                </div>
            </div>

            <div className="rooms ml-2 mr-1 bg-gray-700 mt-1 rounded-lg"
                 style={{width: '19%', height: '74.1vh'}}>
                Adds baner
            </div>
        </div>
    );

};

export default Chat;

const express = require("express");
const cors = require("cors");
const {readdirSync} = require("fs");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
require('dotenv').config({path: './.env'});
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'dnt96jajl',
    api_key: '927538622553716',
    api_secret: '17oujNiY6cnjTsgBLjGjq_vTo24'
});

const users = require("./routes/user");
const User = require("./models/User");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());
app.use(cors());


// Routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

// Database
mongoose.connect(
    "mongodb+srv://SocialAdmin:Kamilop123@socialnetwork.ktwzwur.mongodb.net/?retryWrites=true&w=majority&appName=SocialNetwork",
    {
        useNewUrlParser: true,
    }
)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Error connecting to MongoDB", err));


// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}..`);
});

// CHAT

//CHAT VAR
// const chatMessages = [];
let chatdelay = new Map();
const activeSessions = new Set();

//CHAT VAR


const initSocketIO = (server) => {

    const io = socketIO(server, {
        cors: {
            origin: true,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    let chatMessages = {};

    //START IO COINNECION-------------------------------------------------------------------------------

    io.on("connection", (socket) => {


        activeSessions.add(socket.id);
        updateOnlineUsersCount()

        function updateOnlineUsersCount() {
            const onlineUsersCount = activeSessions.size;
            console.log("users: ", onlineUsersCount)
            io.emit('onlineUsersCount', onlineUsersCount);
        }


        socket.emit("chat-history", chatMessages);
        socket.on("join-room", (room) => {
            console.log("wedp")
            io.to(socket.id).emit("chatnotify", `Joined`);
            socket.join(room);
            if (chatMessages[room]) {
                socket.emit("chat-history", chatMessages[room]);
            } else {
                chatMessages[room] = [];
            }
        });

        socket.on("send-message", async (message, id, room) => {

            if (!chatdelay.has(id)) {
                chatdelay.set(id, 0);
            }
            let isiddelay = chatdelay.get(id);

            const user = await User.findById(id);

            if (!user) {
                console.error("User not found");
                return;
            }

            if (user.chatban === 0 && !isiddelay) {
                console.log("send")

                chatdelay.set(id, 1);
                setTimeout(async () => {
                    chatdelay.set(id, 0);
                }, 5000);


                if ((user.usertyp === "admin" || user.usertyp === "mod") &&
                    (message.text.startsWith("/mute") || message.text.startsWith("/unmute"))
                ) {
                    const parts = message.text.split(" ");
                    const targetNick = parts[1];

                    let update;

                    if (message.text.startsWith("/mute")) {
                        targetUser = await User.findOneAndUpdate({first_name: targetNick}, {$set: {chatban: 1}});
                    }
                    if (message.text.startsWith("/unmute")) {
                        targetUser = await User.findOneAndUpdate({first_name: targetNick}, {$set: {chatban: 0}});
                    }
                } else {
                    if (
                        user.usertyp === "user" &&
                        (message.text.startsWith("/mute") || message.text.startsWith("/unmute"))

                    ) {
                        io.to(socket.id).emit("notify", `It's an Admin command!`);
                    } else {
                        if (!chatMessages[room]) {
                            chatMessages[room] = [];
                        }

                        chatMessages[room].push(message);
                        if (chatMessages[room].length > 100) {
                            chatMessages[room].shift();
                        }
                        console.log(room)
                        io.to(room).emit("receive-message", message);
                    }
                }
            } else if (isiddelay) {
                io.to(socket.id).emit("notify", `Chat delay 5s`);
            } else if (user.chatban === 1) {
                io.to(socket.id).emit("notify", `You have a chat ban!`);
            }
        });
        socket.on('disconnect', () => {
            activeSessions.delete(socket.id);
            updateOnlineUsersCount();
        });

        return io;
    });


}

initSocketIO(server);
const express = require("express");
const cors = require("cors");
const {readdirSync} = require("fs");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
const dotenv = require("dotenv");
require('dotenv').config();

const users = require("./routes/user");
const User = require("./models/User");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

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
const chatMessages = [];
let chatdelay = new Map();

//CHAT VAR


const initSocketIO = (server) => {

    const io = socketIO(server, {
        cors: {
            origin: true,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    //START IO COINNECION-------------------------------------------------------------------------------

    io.on("connection", (socket) => {
        console.log("io runned")
        socket.emit("chat-history", chatMessages);

        socket.on("send-message", async (message, id) => {

            // if (!chatdelay.has(id)) {
            //     chatdelay.set(id, 1);
            // }

            const user = await User.findById(id);

            if (!user) {
                console.error("User not found");
                return;
            }

            if (user.chatban === 0) {

                // setTimeout(async () => {
                //
                // }, 2000);


                if (user.usertyp === "admin" &&
                    (message.text.startsWith("/mute") || message.text.startsWith("/unmute"))
                ) {
                    const parts = message.text.split(" ");
                    const targetNick = parts[1];

                    let update;

                    if (message.text.startsWith("/mute")) {
                        targetUser = await User.findOneAndUpdate({name: targetNick}, {$set: {chatban: 1}});
                        io.emit("receive-message", message);
                    }
                    if (message.text.startsWith("/unmute")) {
                        targetUser = await User.findOneAndUpdate({name: targetNick}, {$set: {chatban: 0}});
                        io.emit("receive-message", message);
                    }
                } else {
                    if (
                        message.user.usertyp === "user" &&
                        (message.text.startsWith("/mute") || message.text.startsWith("/unmute"))

                    ) {
                        io.to(socket.id).emit("notify", `It's an Admin command!`);
                    } else {
                        chatMessages.push(message);
                        if (chatMessages.length > 100) {
                            chatMessages.shift();
                        }
                        io.emit("receive-message", message);
                    }
                }
            } else if (user.chatban !== 0) {
                io.to(socket.id).emit("notify", `Chat delay ${chatban / 1000}s`);
            } else {
                io.to(socket.id).emit("notify", `You have a chat ban!`);
            }
        });

        socket.on("join-room", (room, cb) => {
            socket.join(room);
            cb(`Joined room ${room}`);
        });

        return io;
    });


}

initSocketIO(server);
const express = require("express");
const cors = require("cors");
const {readdirSync} = require("fs");
const users = require("./routes/user");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());


//routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//database
mongoose.connect(
    "mongodb+srv://SocialAdmin:Kamilop123@socialnetwork.ktwzwur.mongodb.net/?retryWrites=true&w=majority&appName=SocialNetwork",
    {
        useNewUrlParser: true,
    }
)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Error connecting to MongoDB", err));

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}..`);
});


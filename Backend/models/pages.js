const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const userSchema = mongoose.Schema(
    {
        page: {
            type: String,
            trim: true,
            text: true,
        },
        link: {
            type: String,
            trim: true,
            text: true,
        },
        description: {
            type: String,
            trim: true,
            text: true,
        }

    }
);

module.exports = mongoose.model("Pages", userSchema);

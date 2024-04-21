const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const Announcement = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fbLink: {
        type: String
    },
    igLink: {
        type: String
    },
    image: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    category: {
        type: String
    },
    owner: {
        type: String
    }

});

module.exports = mongoose.model("Announcement", Announcement);



const mongoose = require("mongoose");
const Post = require("../models/Announcement");

exports.add = async (req, res) => {
    try {
        const {title, description, fbLink, igLink, image, user_id, category, owner, userid} = req.body;
        const newAdvertisement = new Post({
            title,
            description,
            fbLink,
            igLink,
            image,
            user_id,
            category,
            owner,
            userid
        });
        const savedAdvertisement = await newAdvertisement.save();
        res.status(201).json(savedAdvertisement);
    } catch (error) {
        console.error('Error adding advertisement:', error);
        res.status(500).json({error: 'An error occurred while adding the advertisement'});
    }
}


exports.getAnn = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({error: 'An error occurred while fetching posts'});
    }
}

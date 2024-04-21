const mongoose = require("mongoose");
const Pages = require("../models/pages");

exports.getAllPages = async (req, res) => {
    try {
        const pagesData = await Pages.find({}, {_id: 0, __v: 0});
        if (pagesData.length > 0) {
            res.json(pagesData);
        } else {
            res.status(404).json({message: 'No pages found'});
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

const jwt = require('jsonwebtoken');

exports.addPage = async (req, res) => {
    try {
        const {page, link, description} = req.body;
        if (!req.headers.authorization) {
            return res.status(401).json({message: 'Unauthorized - Missing token'});
        }
        const token = req.headers.authorization;
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                console.error('Error verifying token:', err);
                return res.status(401).json({message: 'Unauthorized - Invalid token'});
            }

            console.log('Decoded token:', decodedToken);
            if (err) {
                return res.status(401).json({message: 'Unauthorized - Invalid token'});
            }

            if (decodedToken.userTyp !== 'admin') {
                return res.status(403).json({message: 'Forbidden - Insufficient permissions'});
            }

            const newPage = new Pages({page, link, description});
            newPage.save();
            res.status(201).json({message: 'Page added successfully', newPage});
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

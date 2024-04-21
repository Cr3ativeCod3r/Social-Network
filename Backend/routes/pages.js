const express = require("express");
const router = express.Router();

const {
    getAllPages,
    addPage
} = require("../controllers/pages");

const {
    add,
    getAnn
} = require("../controllers/Announcement");


router.get('/pages', getAllPages);
router.post('/addpages', addPage);
router.post('/addAnn', add);
router.get('/getAnn', getAnn);

module.exports = router;

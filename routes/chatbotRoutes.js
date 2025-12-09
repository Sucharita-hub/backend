const express = require('express');
const router = express.Router();
const chatbotCtrl = require("../controllers/chatbotController");

router.post('/ask', chatbotCtrl.chatbotReply);

module.exports = router;
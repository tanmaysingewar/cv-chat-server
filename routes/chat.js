const express = require("express");
// import { getRelativeInfo } from "../services/getRelativeInfo.js";
// import { getResponseByBot } from "../services/getResponseByBot.js";
const { getRelativeInfo } = require("../services/getRelativeInfo");
const { getResponseByBot } = require("../services/getResponseByBot");

const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim() === "") {
            return res.status(400).json({ error: "Please provide a question" });
        }

        // Get relative information
        const { relativeInfo, cit, drt } = await getRelativeInfo(question);

        // Get bot response
        const botResponse = await getResponseByBot(question, relativeInfo, cit, drt);

        return res.json(botResponse);
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({ error: "Error occurred while generating the response" });
    }
});

module.exports = router;

const express = require("express");
// import { getRelativeInfo } from "../services/getRelativeInfo.js";
// import { getResponseByBot } from "../services/getResponseByBot.js";
const { getRelativeInfo } = require("../services/getRelativeInfo");
const { getResponseByBot } = require("../services/getResponseByBot");
const { asyncSaveToRedis } = require("../services/asyncSaveToRedis");

const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
      const { question } = req.body;
  
      if (!question || question.trim() === "") {
        return res.status(400).json({ error: "Please provide a question" });
      }
  
      // Get relative information
      const relativeInfo = await getRelativeInfo(question);
      console.log("Relative Info -", relativeInfo);
  
      // Get bot response
      const botResponse = await getResponseByBot(
        question,
        relativeInfo.relativeInfo,
        relativeInfo.cit,
        relativeInfo.drt
      );
      res.json(botResponse);
      console.log(botResponse);
  
      if (botResponse.save_info === "YES") {
        // Save data to redis
        await asyncSaveToRedis(botResponse.response, relativeInfo.relativeInfo);
      }
  
    //   console.log("Response generated successfully");
    } catch (error) {
      console.error("Error occurred:", error);
      return res.status(500).json({ error: "Error occurred while generating the response" });
    }
  });
  

module.exports = router;

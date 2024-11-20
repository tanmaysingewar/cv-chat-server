const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Utility function to call Groq API
async function callGroqApi(prompt, model = "llama-3.1-70b-versatile") {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: model,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error calling Groq API:", error);
      return null;
    }
  }

module.exports = { callGroqApi };
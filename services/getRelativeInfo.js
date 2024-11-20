const redisClient = require("../utils/redisClient");
const { callGroqApi } = require("./callGroqApi");

async function getRelativeInfo(question) {
  console.log(question);

  const relativeInfoPrompt = `
        ## Instruction
        - Categorize the question into one of the predefined categories.
        - Categories: general, skills, interests, relationships, emotion, knowledge, memory, tasks, goals, preferences, opinions, habits.
        - If the question does not belong to any category, respond with NO.
        - All keys are in smallcase.

        ## User Question
        ${question}
    `;
  const startTime = Date.now();
  const category = await callGroqApi(relativeInfoPrompt);
  console.log(category);

  const cit = Date.now() - startTime;

  const redisKeyPattern = `${category}:*`;
  console.log(`Fetching Redis keys matching pattern: ${redisKeyPattern}`);

  const startDrt = Date.now();
  let response = "";

  const keys = await redisClient.keys(redisKeyPattern); // Get all keys matching the pattern
  if (keys.length === 0) {
    console.log("No keys found.");
  } 
  else {
    console.log("Found keys:", keys);
    const values = await redisClient.mget(keys); // Fetch all values for the keys
    keys.map((key, index) => (response += `${key} - ${values[index]}\n`));
  }

  const drt = Date.now() - startDrt;

  return { relativeInfo: response, cit, drt };
}

module.exports = { getRelativeInfo };

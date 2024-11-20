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

    var stream = await redisClient.scanStream({
      match: redisKeyPattern,
      count: 100,
    });
    stream.on("data", async function (resultKeys) {
      // `resultKeys` is an array of strings representing key names.
      for (var i = 0; i < resultKeys.length; i++) {
        let value = await redisClient.get(resultKeys[i]);
        console.log(resultKeys[i] + ":" + value);
        response += `${resultKeys[i]} - ${value}\n`;
      }
    });

    const drt = Date.now() - startDrt;

    return { relativeInfo: response, cit, drt };
}

module.exports = { getRelativeInfo };   

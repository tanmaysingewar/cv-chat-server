const { default: callGroqApi } = require("./callGroqApi");

// Function to get relative info
async function getRelativeInfo(question) {
    const relativeInfoPrompt = `
          ## Instruction
          - Categorize the question into one of the predefined categories.
          - Categories: general, skills, interests, relationships, emotion, knowledge, memory, tasks, goals, preferences, opinions, habits.
          - If the question does not belong to any category, respond with NO.
  
          ## User Question
          ${question}
      `;
    const startTime = Date.now();
    const category = await callGroqApi(relativeInfoPrompt);
    const cit = Date.now() - startTime;
  
    const redisKeyPattern = `${category}:*`;
    console.log(`Fetching Redis keys matching pattern: ${redisKeyPattern}`);
  
    let cursor = "0";
    const result = {};
    const startDrt = Date.now();
  
    do {
      const [newCursor, keys] = await redisScan(cursor, "MATCH", redisKeyPattern);
      cursor = newCursor;
  
      for (const key of keys) {
        const value = await redisGet(key);
        if (value) result[key] = value;
      }
    } while (cursor !== "0");
  
    const drt = Date.now() - startDrt;
    const response = Object.entries(result)
      .map(([key, value]) => `${key} - ${value}`)
      .join("\n");
  
    return { relativeInfo: response, cit, drt };
  }
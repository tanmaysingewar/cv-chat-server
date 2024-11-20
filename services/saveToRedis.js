const redisClient = require("../utils/redisClient");

async function saveToRedis(dataString) {
    const entries = dataString.split("\n");
    for (const entry of entries) {
        if (entry.includes("Value:")) {
            const [key, value] = entry.split("Value:").map(str => str.trim());
            console.log(`Saving key: ${key}, value: ${value} to Redis...`);
            await redisClient.set(key, value);
        }
    }
    return "Data successfully saved to Redis.";
}

module.exports = { saveToRedis };

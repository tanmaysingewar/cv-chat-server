const { saveToRedis } = require("./saveToRedis");

async function asyncSaveToRedis(data) {
    await saveToRedis(data);
}

module.exports = { asyncSaveToRedis };

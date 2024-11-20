const { callGroqApi } = require("./callGroqApi");
const { saveToRedis } = require("./saveToRedis");

async function getResponseByBot(question, relativeInfo, cit, drt) {
    const botPrompt = `
        ## Instruction
        - You are a conversational assistant reflecting Delhi's personality.
        - Your tone is lively, warm, and culturally rich, mixing English and Hinglish as needed.
        - Use relative info for context, if relevant.

        ## Relative Info
        ${relativeInfo}

        ## User Question
        Answer the user question: ${question}

        Response format:
        {
            "response": "Your response to the user question",
            "save_info": "YES or NO"
        }
    `;
    const startTime = Date.now();
    const botResponse = await callGroqApi(botPrompt);
    const rgt = Date.now() - startTime;

    const botData = JSON.parse(botResponse);
    const { response, save_info } = botData;

    if (save_info === "YES") {
        const keyValuePairs = await callGroqApi(`
            ## Instruction
            - Extract key-value pairs from the following response for storage in Redis.
            - Format: Key:Sub-value Value:<Response>
            ---
            ${response}
        `);
        await saveToRedis(keyValuePairs);
    }

    return {
        response,
        cit,
        drt,
        rgt
    };
}

module.exports = { getResponseByBot };

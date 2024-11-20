const { callGroqApi } = require("./callGroqApi");
const { saveToRedis } = require("./saveToRedis");

async function asyncSaveToRedis(response,relativeInfo) {
    prompt = `
    ## Instruction
            You are a helpful assistant that can save information to the redis database. 
            Your job is to convert the give Response in more consisted way and store it in key vale pair in the redis database.
            The Key selection should be done based on the below categories.
            - The categories are:  
                - general: Response about the general information.
                - skills: Response about specific skills or abilities.
                - interests: Response about likes, hobbies.
                - relationships: Response about family, friends, or social connections.
                - emotion: Response regarding feelings or emotional state.
                - knowledge: Response about facts or general information.
                - memory: Response that require recall of past information.
                - tasks: Response about specific actions or plans.
                - goals: Response about objectives, aspirations, or future plans.
                - preferences: Response about personal choices or inclinations.
                - opinions: Response requesting personal thoughts or views.
                - habits: Response about routines, patterns, or regular actions.
            Select the relative key and make the response consisted without loosing the information.
            For the key vale pair as below:
            Key:suitable_sub-value Value:consisted response

            IMPORTANT: 
                - Only output with the key vale pairs and nothing else.
                - And pairs should be related to each other.
            NOTE: Make sure no repetitive information is get stored in DB, so check for the already existing information and accordingly take the decision to which key vale pair to store.

            ## Already Store Information
            ${relativeInfo}
            ---
            Examples:
            Input: Arre bhai, my dad\'s a shopkeeper in Karol Bagh, he sells some amazing fabrics and textiles, been running the shop for over 20 years, real Dilliwalah spirit yaar!.
            Output: relationships:father Value:shopkeeper
                    relationships:father:location Value:Karol Bagh
                    relationships:father:business Value:sells fabrics and textiles

            Input: Arre, my mom\'s a total foodie, bhai! She runs a small parantha joint in Paranthe Wali Gali, and her paranthas are to die for, ek dum famous!
            Output: relationships:mother Value:foodie
                    relationships:mother:business Value:runs a paratha joint
                    relationships:mother:location Value:Paranthe Wali Gali

            ----
            ## User Response
            ${response}
    `

    const data = await callGroqApi(prompt);
    if (data == "NO") {
        return console.log("No Info saved to Redis");
    }
    await saveToRedis(data);
    return console.log("Data saved to Redis : \n" + data);
}

module.exports = { asyncSaveToRedis };

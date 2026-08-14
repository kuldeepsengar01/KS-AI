const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateAIResponse(message) {
    try {

        if (!message) {
            throw new Error("Message is required");
        }

        const response = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: message
        });

        console.log("Gemini response:", response);

        return response.output_text;

    } catch (error) {

        console.error("AI Service Error:", error);

        throw error;
    }
}

module.exports = {
    generateAIResponse
};
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * AI-powered symptom analysis using Groq (Llama-3)
 * @param {Array} symptoms - Array of symptom strings
 * @param {String} duration - Duration of symptoms
 * @param {String} severity - Severity level
 * @returns {Object} Analysis result containing conditions, doctor recommendation, suggested medicines, and emergency flag
 */
const analyzeSymptomsAI = async (symptoms, duration, severity) => {
    const prompt = `
    You are a professional medical assistant AI. Analyze the following patient symptoms and provide a structured assessment.
    
    PATIENT DATA:
    - Symptoms: ${symptoms.join(', ')}
    - Duration: ${duration}
    - Severity: ${severity}
    
    INSTRUCTIONS:
    1. Identify the top 3-5 most likely medical conditions.
    2. Recommend the single most appropriate medical specialist to consult.
    3. Suggest common over-the-counter (OTC) medicines (if applicable) with a strong disclaimer to consult a pharmacist.
    4. Determine if this is a medical emergency (e.g., chest pain, difficulty breathing, stroke symptoms).
    
    RESPONSE FORMAT (STRICT JSON ONLY):
    {
      "conditions": [
        {"name": "Condition Name", "probability": "High/Medium/Low"}
      ],
      "recommendedDoctor": "Specialist Name (e.g., Cardiologist)",
      "suggestedMedicine": ["Medicine 1", "Medicine 2"],
      "emergencyWarning": true/false
    }
    
    IMPORTANT: Provide ONLY the JSON. Do not include any conversational text.
    `;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional medical diagnostic assistant. You output only structured JSON data."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(chatCompletion.choices[0].message.content);
        return result;

    } catch (error) {
        console.error('Groq AI Analysis Error:', error);
        throw new Error('Failed to analyze symptoms via AI');
    }
};

/**
 * AI-powered general health chat using Groq (Llama-3)
 * @param {Array} messages - Array of message objects {role, content}
 * @returns {String} AI response content
 */
const chatWithAI = async (messages) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional medical and wellness assistant. Provide helpful, accurate, and empathetic advice. Always include a disclaimer that you are an AI and not a substitute for professional medical advice, especially for serious concerns."
                },
                ...messages
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return chatCompletion.choices[0].message.content;

    } catch (error) {
        console.error('Groq AI Chat Error:', error);
        throw new Error('Failed to communicate with AI assistant');
    }
};

module.exports = { analyzeSymptomsAI, chatWithAI };

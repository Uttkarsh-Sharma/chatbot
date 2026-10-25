import express from "express";

import dotenv from "dotenv";

import {GoogleGenAI} from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// * For parsing JSON data in request body
app.use(express.json());

/* 
   * Streaming Response 
const main = async () =>{
    const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: "who is SRK??"
    });

    for await (const chunk  of responseStream) {
        console.log(chunk.text);
    }
}
*/

/* 
    * Non-Streaming Response 
    const main = async () =>{
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "who is SRK??"
    });

    console.log(response.text);
}

main().catch((err) => console.error("Gemini error:", err.message));
*/

app.post("/chat",async (req,res)=> {
    const {prompt} = req.body;

    const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
    });

    return res.json(result.text)
})


app.listen(PORT , ()=> {
    console.log(`Server is running on port ${PORT}`);
})
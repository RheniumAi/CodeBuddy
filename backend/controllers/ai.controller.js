// ai.controller.js
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import asyncHandler from "express-async-handler"; 

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const api_key = process.env.HUGGINGFACE_TOKEN;

if (!api_key) {
  throw new Error("HUGGINGFACE_TOKEN is not set. Check your .env file.");
}

const inference = new HfInference(api_key);

// Controller function for AI Code Generation
export const generateCode = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    const result = await inference.textGeneration({
      model: "HuggingFaceH4/starchat-beta",
      inputs: prompt,
      parameters: {
        max_new_tokens: 100, 
        temperature: 0.2, 
        top_p: 0.9, 
        return_full_text: false, 
      },
    });

    console.log("AI Response:", result.generated_text);
    res.status(200).json({ response: result.generated_text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to generate code" });
  }
});

import { GoogleGenerativeAI } from "@google/generative-ai";

export const runGemini = async (prompt) => {
  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY
  );

  // The model Google told you to use
  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-pro-preview-03-25",
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
};

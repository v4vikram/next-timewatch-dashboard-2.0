import { runGemini } from "@/lib/gemini";
import { parseAiJson } from "./parseAiJson";
import toast from "react-hot-toast";

// Ai generated handler
export const generateWithAI = async (promt, setAiLoading) => {
  if (!promt || promt.trim().length < 3) {
    toast.error("Please enter a title before generating content.");
    return null;
  }

  setAiLoading(true);
  toast.loading("Generating content with AI...", { id: "ai-gen" });

  const prompt = `
You are a helpful assistant that returns a single valid JSON object and nothing else.

Produce a blog article about: "${promt}".

Return JSON with three keys:
- "html": a single string containing ONLY Quill-compatible HTML 
  (allowed: <h1>, <h2>, <h3>, <p>, <strong>, <em>, <u>, <ol>, <ul>, <li>, <a>, <img>)
  * Include:
      - introduction (~100 words)
      - article (~1000 words) using <h2>/<h3> + <p>

- "seoDescription": string <= 160 chars
- "keywords": comma-separated keywords

Example:
{"html":"<h2>Intro</h2><p>...</p>","seoDescription":"...","keywords":"kw1, kw2"}

Return valid JSON only — no extra text.
`;

  try {
    const rawResponse = await runGemini(prompt);

    const { html, seoDescription, keywords } = parseAiJson(rawResponse);

    if (!html || html.trim() === "") {
      toast.error("AI did not return valid HTML content.");
      toast.dismiss("ai-gen");
      return null;
    }

    toast.success("AI content generated successfully!", { id: "ai-gen" });

    return {
      html,
      seoDescription,
      keywords,
      raw: rawResponse, // optional: keep if you need debugging
    };

  } catch (err) {
    console.error("AI generation error:", err);
    toast.error("AI generation failed. Try again.", { id: "ai-gen" });
    return null;
  } finally {
    setAiLoading(false);
  }
};

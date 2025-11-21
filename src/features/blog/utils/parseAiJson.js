export const parseAiJson = (raw) => {
  try {
    return JSON.parse(raw);
  } catch (e) {
    const htmlMatch = raw.match(/"html"\s*:\s*"([\s\S]*?)"(,|\})/i);
    const seoMatch =
      raw.match(/"seoDescription"\s*:\s*"([\s\S]*?)"(,|\})/i) ||
      raw.match(/SEO description[:\-]\s*["']?([^"\n\r]*)/i);

    const keywordsMatch =
      raw.match(/"keywords"\s*:\s*"([\s\S]*?)"(,|\})/i) ||
      raw.match(/Keywords[:\-]\s*([^"\n\r]*)/i);

    const html = htmlMatch ? htmlMatch[1] : "";
    const seoDescription = seoMatch ? seoMatch[1].trim() : "";
    const keywords = keywordsMatch ? keywordsMatch[1].trim() : "";

    return {
      html,
      seoDescription,
      keywords,
    };
  }
};

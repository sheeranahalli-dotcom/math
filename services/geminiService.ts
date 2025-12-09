import { StatisticsResult } from "../utils/statistics";

/**
 * Note: we avoid importing @google/genai at module top-level because
 * that package may depend on Node-only APIs and can break the browser bundle.
 * We dynamically import it only when getCovarianceAnalysis is called.
 */
export const getCovarianceAnalysis = async (stats: StatisticsResult): Promise<string> => {
  try {
    // If no API key is provided, fail early with friendly message.
    if (!process.env.API_KEY) {
      throw new Error("No Gemini API key configured.");
    }

    // Dynamically import to keep the initial bundle small and avoid module-eval issues.
    const genaiModule = await import('@google/genai').catch((err) => {
      console.error("Dynamic import of @google/genai failed:", err);
      throw new Error("AI SDK unavailable in this environment.");
    });

    // Some SDKs export a default or named constructor — adapt if needed.
    const { GoogleGenAI } = genaiModule as any;
    if (!GoogleGenAI) {
      throw new Error("GoogleGenAI not found in @google/genai module.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const dataSummary = stats.data.length > 50
      ? `First 50 points: ${JSON.stringify(stats.data.slice(0, 50))}... (Total ${stats.n} points)`
      : JSON.stringify(stats.data);

    const prompt = `
      As a senior statistician, analyze the following covariance calculation results.
      ...
      (same prompt body as before)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful statistical analysis assistant. Be concise and accurate.",
        temperature: 0.3,
      }
    });

    return response.text || "No analysis could be generated.";
  } catch (err: any) {
    console.error("getCovarianceAnalysis error:", err);
    // Propagate a friendly message to UI
    throw new Error(err.message || "Failed to generate AI analysis.");
  }
};
import { GoogleGenAI } from "@google/genai";
import { StatisticsResult } from "../utils/statistics";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCovarianceAnalysis = async (stats: StatisticsResult): Promise<string> => {
  try {
    // We summarize the data for the prompt to avoid token limits if the dataset is huge
    const dataSummary = stats.data.length > 50 
      ? `First 50 points: ${JSON.stringify(stats.data.slice(0, 50))}... (Total ${stats.n} points)` 
      : JSON.stringify(stats.data);

    const prompt = `
      As a senior statistician, analyze the following covariance calculation results.
      
      **Statistics:**
      - N (Sample Size): ${stats.n}
      - Mean X: ${stats.meanX.toFixed(4)}
      - Mean Y: ${stats.meanY.toFixed(4)}
      - Sample Covariance: ${stats.sampleCovariance.toFixed(4)}
      - Population Covariance: ${stats.populationCovariance.toFixed(4)}
      
      **Data:**
      ${dataSummary}

      **Task:**
      1. Interpret the covariance value (positive, negative, or near zero) and what it implies about the relationship between X and Y.
      2. Explain the difference between the sample and population covariance in this context.
      3. Briefly mention if the relationship appears linear or if there might be outliers based on the provided data points.
      4. Keep the tone professional but accessible. Use Markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful statistical analysis assistant. Be concise and accurate.",
        temperature: 0.3, // Lower temperature for more analytical/deterministic output
      }
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Error generating analysis:", error);
    throw new Error("Failed to generate AI analysis. Please check your connection or API key.");
  }
};

import { GoogleGenAI, Type } from "@google/genai";
import { Product, AIInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getInventoryInsights = async (products: Product[]): Promise<AIInsight[]> => {
  try {
    const productList = products.map(p => `${p.name} (Stock: ${p.stock}, Price: $${p.price})`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert liquor store manager and sommelier. Analyze this inventory and provide 3 actionable business insights in JSON format.
      
      Inventory Data:
      ${productList}
      
      Requirements:
      1. Provide exactly 3 insights.
      2. One must be a restocking alert based on low stock.
      3. One must be a cross-selling recommendation.
      4. One must be a pricing or trend opportunity.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['recommendation', 'alert', 'opportunity'] }
            },
            required: ['title', 'description', 'type']
          }
        }
      }
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      {
        title: "Stock Analysis Delayed",
        description: "Unable to reach the AI engine for live insights. Please check your stock manually.",
        type: "alert"
      }
    ];
  }
};

export const getSmartRecommendation = async (query: string, products: Product[]): Promise<string> => {
  try {
    const productList = products.map(p => `${p.name} - ${p.description}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `A customer says: "${query}". Based on the following inventory, recommend 1-2 bottles and explain why they match the request. Be elegant and knowledgeable.
      
      Inventory:
      ${productList}`,
    });
    return response.text || "I couldn't find a specific match, but I recommend checking our premium whiskey section.";
  } catch (error) {
    return "The sommelier is currently unavailable. Please browse our collection.";
  }
};

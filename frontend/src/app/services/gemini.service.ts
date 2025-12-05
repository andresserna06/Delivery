import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  private genAI = new GoogleGenerativeAI(environment.GEMINI_API_KEY);

  constructor() {}

  async preguntar(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash"  // <-- este sí es para chat
      });

      const result = await model.generateContent(prompt);
      return result.response.text();

    } catch (e: any) {
      console.error("Error en preguntar():", e);
      throw new Error("No se pudo generar la respuesta desde Gemini.");
    }
  }

  async generarEmbedding(text: string): Promise<number[]> {
    try {
      const embeddingModel = this.genAI.getGenerativeModel({
        model: "models/embedding-gecko-001" // <-- MODELO CORRECTO PARA EMBEDDINGS
      });

      const result = await embeddingModel.embedContent(text);
      return result.embedding.values;

    } catch (e: any) {
      console.error("Error en generarEmbedding():", e);
      throw new Error("No se pudo generar el embedding.");
    }
  }
}

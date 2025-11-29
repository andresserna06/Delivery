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
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

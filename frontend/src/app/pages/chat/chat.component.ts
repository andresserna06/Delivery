import { Component, OnInit } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';
import promptData from './prompt.json';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  userMessage = '';
  messages: any[] = [];
  isSpeaking = false;
  isMuted = false;
  private synth = window.speechSynthesis;

  constructor(private geminiService: GeminiService) { }

  ngOnInit() {
    this.messages.push({
      role: 'bot',
      text: '¡Hola! Soy un chat de ayuda al usuario. ¿En qué puedo ayudarte hoy?'
    });
    this.speak('¡Hola! Soy un chat de ayuda al usuario. ¿En qué puedo ayudarte hoy?');
  }

  async sendMessage() {
    if (!this.userMessage.trim()) return;

    const text = this.userMessage;
    this.messages.push({ role: 'user', text });
    this.userMessage = '';

    this.messages.push({ role: 'bot', text: 'Procesando...', loading: true });
    this.isSpeaking = true;

    try {
      const fullPrompt = `${promptData.system_prompt}\n\nUsuario: ${text}`;
      const response = await this.geminiService.preguntar(fullPrompt);

      this.messages = this.messages.filter(m => !m.loading);
      this.messages.push({ role: 'bot', text: response });
      this.speak(response);
    } catch (error) {
      this.messages = this.messages.filter(m => !m.loading);
      this.messages.push({ role: 'bot', text: 'Error al conectar con el servicio.' });
      this.isSpeaking = false;
    }
  }

  speak(text: string) {
    if (this.isMuted) {
      this.isSpeaking = false;
      return;
    }

    this.synth.cancel(); // Stop previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-VE'; // Try Venezuelan Spanish

    // Fallback if specific voice not found (browser handles this usually, but good to be explicit if needed)
    // Note: Voice selection is async in some browsers, but lang usually works well enough for generic selection.

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
    };

    this.synth.speak(utterance);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent {
  open = false;

  toggleChat() {
    this.open = !this.open;
  }
}

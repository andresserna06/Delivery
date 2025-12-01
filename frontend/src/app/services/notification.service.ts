import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  timestamp: Date;
  read: boolean;
  orderId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();

  private notificationsSource = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSource.asObservable();

  private notifications: Notification[] = [];
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
    this.audio.src = this.createBeepSound();
    this.audio.load();
  }

  private createBeepSound(): string {
    // Sonido de notificación simple
    return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE';
  }

  notifyNewOrder(orderId: number, driverName?: string): void {
    const notification: Notification = {
      id: Date.now(),
      title: '🔔 ¡Nuevo Pedido!',
      message: driverName 
        ? `Pedido #${orderId} asignado a ${driverName}`
        : `Nuevo pedido #${orderId} creado`,
      type: 'info',
      timestamp: new Date(),
      read: false,
      orderId: orderId
    };

    this.notifications.unshift(notification);
    this.notificationsSource.next(this.notifications);
    this.notificationSubject.next(notification);
    this.playSound();
  }

  private playSound(): void {
    try {
      this.audio.currentTime = 0;
      this.audio.play().catch(err => {
        console.warn('No se pudo reproducir el sonido:', err);
      });
    } catch (error) {
      console.warn('Error al reproducir sonido:', error);
    }
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notificationsSource.next(this.notifications);
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notificationsSource.next(this.notifications);
  }

  clearAll(): void {
    this.notifications = [];
    this.notificationsSource.next(this.notifications);
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  deleteNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsSource.next(this.notifications);
  }
}
import { Injectable } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  constructor(private notificationService: NotificationService) { }
  successmessage(message: string): void {
    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'success', icon: true },
      closable: true
    });
  }
  public errormessage(message: string): void {
    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'error', icon: true },
      closable: true
    });
  }
  public Infomessage(message: string): void {
    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'info', icon: true },
      closable: true
    });
  }
}

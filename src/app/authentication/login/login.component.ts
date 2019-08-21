import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(private notificationService: NotificationService ) { 
  }

  ngOnInit() {
    
  }

  public show(message: string): void {
    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'success', icon: true },
      closable: true
    });
  }
}

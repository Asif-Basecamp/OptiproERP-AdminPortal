import { Component, OnInit } from '@angular/core';
//import { NotificationService } from '@progress/kendo-angular-notification';
import { Router } from '@angular/router';    
import { LoginService } from '../../service/login.service';    
import { MessageService } from '../../common/message.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {    
    
  model : any={};    
  successmsg: any;  
  errorMessage:string;    
  constructor(private router:Router,private LoginService:LoginService,private MessageService:MessageService) { }    
    ngOnInit() {    
    sessionStorage.removeItem('UserName');    
    sessionStorage.clear();    
  }   

  login(){    
    debugger;    
    this.LoginService.Login(this.model).subscribe(    
      data => {    
        debugger;    
        //if(data.Status=="Success") 
        if(data != null)   
        {       
          this.successmsg = 'token - ' + data.access_token;  
          localStorage.setItem('access_token', data.access_token);       
          localStorage.setItem('token_type', data.token_type); 
          localStorage.setItem('expires_in', data.expires_in); 
          this.router.navigate(['/main']);    
          debugger;    
        }    
        else{ 
          this.MessageService.errormessage("UserName or Password is invalid");
          //this.errorMessage = data.Message;    
        }    
      },    
      error => { 
        this.MessageService.errormessage(error.message);   
          
      });    
  };    
  
}

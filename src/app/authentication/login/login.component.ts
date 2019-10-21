import { Component, OnInit } from '@angular/core';
//import { NotificationService } from '@progress/kendo-angular-notification';
import { Router } from '@angular/router';    
import { LoginService } from '../../service/login.service';    
import { MessageService } from '../../common/message.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {    
    
  model : any={};    
  successmsg: any;  
  selectedItem: string = ""; 
  errorMessage:string;    
  constructor(private router:Router,private LoginService:LoginService,private MessageService:MessageService,
    private translate: TranslateService, private httpClientSer: HttpClient) { 
      translate.use(localStorage.getItem('applang'));
        translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.selectedItem = translate.instant("Login_Username"); 
        }); 
    }    
    ngOnInit() {     
    sessionStorage.removeItem('UserName');    
    sessionStorage.clear();    
  }   

  login(){     
    this.selectedItem = this.translate.instant("Login_Username");
    this.LoginService.Login(this.model).subscribe(    
      data => {    
        //if(data.Status=="Success") 
        if(data != null)   
        {       
          this.successmsg = 'token - ' + data.access_token;  
          localStorage.setItem('access_token', data.access_token);       
          localStorage.setItem('token_type', data.token_type); 
          localStorage.setItem('expires_in', data.expires_in); 
          //this.auth.sendToken(data.access_token)
          // this.router.navigate(['/main']); 
          this.AdminLoginLog();     
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
  AdminLoginLog(){ 
    this.LoginService.AdminLoginLog(this.model).subscribe(    
      data => {     
        //if(data.Status=="Success") 
        if(data.data == "True")   
        {     
          this.router.navigate(['/main']);       
        }    
        else{ 
          this.MessageService.errormessage("UserName or Password is invalid");
          //this.errorMessage = data.Message;      
        }     
      },    
      error => { 
        this.MessageService.errormessage(error.message); 
      });   
  }
}

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
  arrConfigData:any=[];
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
    this.httpClientSer.get('./assets/config.json').subscribe(
      data => {
        this.arrConfigData = data as string[];
        localStorage.setItem('arrConfigData', this.arrConfigData.service_url); 
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }  

  login(){     
    this.selectedItem = this.translate.instant("Login_Username");
    this.LoginService.Login(this.model).subscribe(    
      data => {    
        //if(data.Status=="Success") 
        if(data != null)   
        {       
          this.successmsg = 'token - ' + data[0].access_token;  
          localStorage.setItem('access_token', data[0].access_token);       
          localStorage.setItem('token_type', data[0].token_type); 
          localStorage.setItem('expires_in', data[0].expires_in); 
          //this.auth.sendToken(data.access_token)
          // this.router.navigate(['/main']); 
          this.AdminLoginLog();     
        }     
        else{ 
          this.MessageService.errormessage(this.translate.instant('UPInvaild'));
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
        if(data == "True")   
        {     
          this.router.navigate(['/main']);       
        }    
        else{ 
          this.MessageService.errormessage(this.translate.instant('UPInvaild'));
          //this.errorMessage = data.Message;    
          //comments here  
        }     
      },    
      error => { 
        this.MessageService.errormessage(error.message); 
      });   
  }
}

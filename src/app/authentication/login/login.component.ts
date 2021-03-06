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
  public Loading: boolean = false;
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
    this.arrConfigData=[];
    localStorage.removeItem('arrConfigData');  
    localStorage.removeItem('admin_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_in');  
    this.httpClientSer.get('./assets/config.json').subscribe(
      data => {
       
        this.arrConfigData = data as string[];
        localStorage.setItem('arrConfigData', this.arrConfigData[0].service_url); 
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }  

  login(){ 
    this.selectedItem = this.translate.instant("Login_Username");
    this.Loading=true;
    this.LoginService.Login(this.model).subscribe(    
      data => {    
        //if(data.Status=="Success")
        //console.log(data[0]); 
        if(data != null)   
        { 
          console.log(data[0]); 
          this.Loading=false;      
          this.successmsg = 'token - ' + data[0].access_token; 
          localStorage.setItem('admin_user', data[0].adminUser);  
          localStorage.setItem('access_token', data[0].access_token);       
          localStorage.setItem('token_type', data[0].token_type); 
          localStorage.setItem('expires_in', data[0].expires_in); 
          //this.auth.sendToken(data.access_token)
          // this.router.navigate(['/main']); 
          this.AdminLoginLog();     
        }     
        else{ 
          this.MessageService.errormessage(this.translate.instant('UPInvaild'));
          this.Loading=false;   
          //this.errorMessage = data.Message;    
        }    
      },    
      error => { 
        this.MessageService.errormessage(error.message); 
        this.Loading=false;   
      });    
  };    
  AdminLoginLog(){ 
    this.Loading=true;   
    this.LoginService.AdminLoginLog(this.model).subscribe(    
      data => {     
        //if(data.Status=="Success") 
        if(data == "True")   
        {   
          this.Loading=false;     
          this.router.navigate(['/main']);       
        }    
        else{ 
          this.MessageService.errormessage(this.translate.instant('UPInvaild'));
          this.Loading=false;   
          //this.errorMessage = data.Message;    
          //comments here  
        }     
      },    
      error => { 
        this.MessageService.errormessage(error.message); 
        this.Loading=false;   
      });   
  }
}

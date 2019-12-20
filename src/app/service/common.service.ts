import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../common/message.service';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public authTokenstr:string = "401";

  constructor(private translate: TranslateService, private MessageService: MessageService,private router: Router) { }

  public unauthorizedToken(Error){
  
    this.MessageService.errormessage(this.translate.instant('AuthorizationFailed'));
    if(Error.error == this.authTokenstr ){
      
      localStorage.removeItem('admin_user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('expires_in'); 
      localStorage.removeItem('arrConfigData')      
      //localStorage.clear();
      this.router.navigate(['/login']);              
    }
  }

}

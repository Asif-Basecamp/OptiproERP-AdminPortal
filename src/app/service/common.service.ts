import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../common/message.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public authTokenstr:string = "The remote server returned an error: (401) Unauthorized.";

  constructor(private MessageService: MessageService,private router: Router) { }

  public unauthorizedToken(Error){
    this.MessageService.errormessage(Error.error.ExceptionMessage);
    if(Error.error.ExceptionMessage == this.authTokenstr ){
      localStorage.removeItem('admin_user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('expires_in');       
      //localStorage.clear();
      this.router.navigate(['/login']);              
    }
  }

}

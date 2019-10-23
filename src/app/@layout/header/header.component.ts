import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';    

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public confirmationOpened = false;

    constructor(private router:Router, private translate: TranslateService, private httpClientSer: HttpClient) {
    }
    ngOnInit() {
        alert(localStorage.getItem('expires_in'));
    }

    public sidebarToggle(): void {
        if(!document.getElementById("sidebar-wrapper").classList.contains("toggle")){
            document.getElementById("sidebar-wrapper").classList.add("toggle");
        }else{
            document.getElementById("sidebar-wrapper").classList.remove("toggle");
        }
    }

    public confirmationToggle() {
        this.confirmationOpened = !this.confirmationOpened;
     }

    Logout(){
        localStorage.clear();
        this.router.navigate(['/login']); 
    }
}

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    constructor() {
    }
    ngOnInit() {
    }

    public sidebarToggle(): void {
        if(!document.getElementById("sidebar-wrapper").classList.contains("toggle")){
            document.getElementById("sidebar-wrapper").classList.add("toggle");
        }else{
            document.getElementById("sidebar-wrapper").classList.remove("toggle");
        }
    }
}

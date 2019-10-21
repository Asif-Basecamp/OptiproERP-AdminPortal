import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class AuthService {
  constructor(private myRoute: Router) { }
  sendToken(token: string) {
    localStorage.setItem("access_token", token)
  }
  getToken() {
    return localStorage.getItem("access_token")
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }
  logout() {
    localStorage.removeItem("access_token");
    this.myRoute.navigate(["Login"]);
  }
}
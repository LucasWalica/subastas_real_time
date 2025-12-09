import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private authService:Auth, private router:Router){

  }

  goToAuctions(){
    this.router.navigate(["/search-auction"])
  }

  goToDashboard(){
    this.router.navigate(["/dashboard"])
  }

  goToChats(){
    this.router.navigate(["/chat-list"])
  }

  logout(){
    // logica de logout
    this.router.navigate(["/home"])
  }


  onLogout() {
    
  }
}

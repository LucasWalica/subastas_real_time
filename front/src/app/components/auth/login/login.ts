import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Login:', this.email, this.password);

    // Aquí luego llamarás a tu API de login
    this.router.navigate(['/home']);
  }
  

  goRegister() {
    this.router.navigate(['/register']);
  }

  goToAuctions(){
    this.router.navigate(["/search-auction"])
  }
}

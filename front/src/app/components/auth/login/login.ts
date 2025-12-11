import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private auth:Auth) {}


  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
  })

  onSubmit(event:Event) {
    event.preventDefault()
    this.auth.login(
      this.loginForm.get("email")?.value??"",
      this.loginForm.get("password")?.value??""
    ).subscribe({
      next: (response) => {
        if(response.user){
          this.router.navigate(['/home']);
        }
      }, error: (err) => {
        console.log("error", err)
      }
    });
    // Aquí luego llamarás a tu API de login
  }
  

  goRegister() {
    this.router.navigate(['/register']);
  }

  goToAuctions(){
    this.router.navigate(["/search-auction"])
  }
}

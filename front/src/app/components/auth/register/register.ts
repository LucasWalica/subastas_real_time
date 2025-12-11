import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../services/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  constructor(private router:Router, private auth:Auth){}

  goLogin(){
    this.router.navigate(["/login"])
  }
  goToAuctions(){
    this.router.navigate(["/search-auction"])
  }

  registerForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    username: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(25),  usernameValidator()]),
    password1: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    password2: new FormControl("",[Validators.required, Validators.minLength(6), Validators.maxLength(20)])
  }, {
    validators: passwordConfirmationValidator("password1", "password2")
  });


  sendRegisterData(event:Event){
    event.preventDefault();
    this.auth.register(
      this.registerForm.get("username")?.value??"",
      this.registerForm.get("email")?.value??"",
      this.registerForm.get("password1")?.value??"",
      this.registerForm.get("password2")?.value??""
    ).subscribe({
      next: (response) => {
        console.log("response", response);
        this.router.navigate(["login"]);
      },
      error: (err) => {
        console.log("Error", err)
      }
    })
  }
}


import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordConfirmationValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(controlName);
    const confirmPasswordControl = formGroup.get(matchingControlName);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null;
  };
}


export function usernameValidator(): ValidatorFn {
  const pattern = /^[\w.@+-]+$/; // letras, números, _ . + -
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // requerido se valida aparte
    return pattern.test(value) ? null : { invalidUsername: true };
  };
}
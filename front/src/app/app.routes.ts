import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:"home", loadComponent:() => import("./components/home/home").then(m=>m.Home)},
    {path:"login", loadComponent:() => import("./components/auth/login/login").then(m=>m.Login)},
    {path:"register", loadComponent:() => import("./components/auth/register/register").then(m=>m.Register)},
    { path: "**", redirectTo: "home" },
];

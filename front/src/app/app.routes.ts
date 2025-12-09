import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:"home", loadComponent:() => import("./components/home/home").then(m=>m.Home)},
    {path:"login", loadComponent:() => import("./components/auth/login/login").then(m=>m.Login)},
    {path:"register", loadComponent:() => import("./components/auth/register/register").then(m=>m.Register)},
    {path:"create-auction", loadComponent:() => import("./components/auction/create-auction-form/create-auction-form").then(m=>m.CreateAuctionForm)},
    {path:"dashboard", loadComponent:() => import("./components/auction/admin-panel/admin-panel").then(m=>m.AdminPanel)},
    {path: "search-auction", loadComponent:() => import("./components/auction/search-auction/search-auction").then(m=>m.SearchAuction)},
    // when added functionality, add index in the url 
    {path:"live-auction", loadComponent:() => import("./components/auction/live-auction-detail/live-auction-detail").then(m=>m.LiveAuctionDetail)},
    {path:"timed-auction", loadComponent:()=>import("./components/auction/timed-auction-detail/timed-auction-detail").then(m=>m.TimedAuctionDetail)},
    {path:"chat-list", loadComponent:() => import("./components/chat/chatlit/chatlit").then(m=>m.Chatlit)},
    {path: "chat", loadComponent:() => import("./components/chat/transaction-chat/transaction-chat").then(m=>m.TransactionChat)},
    {path: "sales-admin", loadComponent:() => import("./components/auction/sales-admin-panel/sales-admin-panel").then(m=>m.SalesAdminPanel)},
    { path: "**", redirectTo: "home" },
];

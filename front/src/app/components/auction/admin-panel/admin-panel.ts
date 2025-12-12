import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auction as auctionService } from '../../../services/auction';
import { Auction } from '../../../services/auction';
import { Navbar } from '../../reusable/navbar/navbar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, Navbar],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit{

  mockAuctions: any[] = [
    { id: 1, title: 'Subasta de Arte Contemporáneo', type: 'live', category: 'Arte y Antigüedades', items: 15, status: 'En vivo' },
    { id: 2, title: 'Antigüedades Europeas', type: 'timed', category: 'Arte y Antigüedades', items: 8, startDate: '2025-12-10', endDate: '2025-12-15' },
    { id: 3, title: 'Colección de Relojes Vintage', type: 'timed', category: 'Joyería', items: 12, startDate: '2025-12-08', endDate: '2025-12-20' },
    { id: 4, title: 'Subasta Benéfica', type: 'live', category: 'Arte y Antigüedades', items: 20, status: 'Programada' },
  ];

  auctions:Auction[] = [] as Auction[];

  constructor(private router:Router, private auctionService:auctionService){

  }

  ngOnInit(): void {
    this.auctionService.getOwnitems().subscribe({
      next: (response) => {
        console.log(response)
      }
    })
  }


  


  createAuction() {
    this.router.navigate(["/create-auction"])
  }

  editAuction(id: number) {
    // add logic to inyect auction information
    this.router.navigate(["/create-auction"])    
  }

  deleteAuction(){
    // add logic to delete auction with confirmation dialog
    alert("wanna delete auction?");
  }

  viewLiveAuction(id: number) {
    this.router.navigate(["/live-auction"])
  }

  viewTimedAuction(id: number) {
    this.router.navigate(["/timed-auction"])
  }

  goToSalesAdmin(){
    this.router.navigate(["/sales-admin"])
  }

  goToItemAdmin(){
    this.router.navigate(["/item-admin"])
  }

}

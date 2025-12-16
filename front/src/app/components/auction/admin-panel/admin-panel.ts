import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Navbar } from '../../reusable/navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, Navbar],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  auctions: any[] = [];

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAuctions();
  }

  loadAuctions(): void {
    this.apiService.getAuctionsByOwner().subscribe({
      next: (response) => {
        this.auctions = response;
      },
      error: (error) => {
        console.error('Error fetching auctions:', error);
      },
    });
  }

  createAuction() {
    this.router.navigate(['/create-auction']);
  }

  editAuction(id: number) {
    this.router.navigate(['/create-auction', { auctionId: id }]);
  }

  deleteAuction(id: number) {
    if (confirm('Are you sure you want to delete this auction?')) {
      this.apiService.deleteAuction(id).subscribe({
        next: () => {
          this.loadAuctions();
        },
        error: (error) => {
          console.error('Error deleting auction:', error);
        },
      });
    }
  }

  viewLiveAuction(id: number) {
    this.router.navigate(['/live-auction', { auctionId: id }]);
  }

  viewTimedAuction(id: number) {
    this.router.navigate(['/timed-auction', { auctionId: id }]);
  }

  goToSalesAdmin() {
    this.router.navigate(['/sales-admin']);
  }

  goToItemAdmin() {
    this.router.navigate(['/item-admin']);
  }
}

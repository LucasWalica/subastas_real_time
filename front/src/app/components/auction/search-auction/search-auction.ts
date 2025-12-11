import { Component } from '@angular/core';
import { Auction } from '../../../models/auction.models';
import { Navbar } from '../../reusable/navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-search-auction',
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './search-auction.html',
  styleUrl: './search-auction.css',
})
export class SearchAuction {
categories = [
    'Todas', 'Arte y Antigüedades', 'Tecnología', 'Joyería', 'Vehículos', 
    'Muebles', 'Coleccionables', 'Ropa y Accesorios', 'Deportes'
  ];

  auctions: any[] = [
    { id: 5, title: 'Colección de Arte Digital NFT', type: 'timed', category: 'Arte y Antigüedades', items: 25, currentBid: 15000, participants: 48, endDate: '2025-12-12', owner: 'CryptoArtGallery' },
    { id: 6, title: 'MacBook Pro & Gadgets', type: 'live', category: 'Tecnología', items: 8, currentBid: 2500, participants: 23, status: 'En vivo', owner: 'TechDeals' },
    { id: 7, title: 'Relojes de Lujo Suizos', type: 'timed', category: 'Joyería', items: 12, currentBid: 45000, participants: 67, endDate: '2025-12-18', owner: 'LuxuryWatch' },
    { id: 8, title: 'Autos Clásicos 1960s', type: 'live', category: 'Vehículos', items: 5, currentBid: 125000, participants: 15, status: 'En vivo', owner: 'ClassicCars' },
    { id: 9, title: 'Muebles Vintage Escandinavos', type: 'timed', category: 'Muebles', items: 18, currentBid: 8500, participants: 34, endDate: '2025-12-14', owner: 'NordicHome' },
  ];

  searchQuery = '';
  selectedCategory = 'Todas';
  selectedType: 'all' | 'live' | 'timed' = 'all';
  showFilters = false;

  filteredAuctions(): Auction[] {
    return this.auctions.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            a.owner.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'Todas' || a.category === this.selectedCategory;
      const matchesType = this.selectedType === 'all' || a.type === this.selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'Todas';
    this.selectedType = 'all';
  }

  viewAuction(a: Auction) {
    if(a.type === 'live') {
      console.log('Ver subasta en vivo', a.id);
    } else {
      console.log('Ver subasta temporizada', a.id);
    }
  }
}

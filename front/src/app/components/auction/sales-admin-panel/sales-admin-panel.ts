import { Component } from '@angular/core';
import { PaymentStatus, ItemGranted } from '../../../models/auction.models';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sales-admin-panel',
  imports: [CommonModule],
  templateUrl: './sales-admin-panel.html',
  styleUrl: './sales-admin-panel.css',
})
export class SalesAdminPanel {
  filterStatus: PaymentStatus | 'All' = 'All';

  mockSales: any[] = [
    { id: 1, itemName: 'Pintura al Óleo - Abstracto Moderno', itemImage: '', winnerName: 'Usuario123', finalPrice: 5000, auctionDate: '10 Dic 2025', status: 'Paid' },
    { id: 2, itemName: 'Escultura de Bronce - Figura Clásica', itemImage: '', winnerName: 'Coleccionista456', finalPrice: 8500, auctionDate: '9 Dic 2025', status: 'Confirmed' },
    { id: 3, itemName: 'Fotografía Vintage - Edición Limitada', itemImage: '', winnerName: 'ArtLover789', finalPrice: 2300, auctionDate: '8 Dic 2025', status: 'Pending' },
    { id: 4, itemName: 'Reloj Antiguo - Suizo 1920', itemImage: '', winnerName: 'TimePiece_Collector', finalPrice: 12000, auctionDate: '7 Dic 2025', status: 'Dispute' },
    { id: 5, itemName: 'Jarrón Chino - Dinastía Ming', itemImage: '', winnerName: 'AsianArtFan', finalPrice: 15500, auctionDate: '6 Dic 2025', status: 'Confirmed' },
  ];

  get filteredSales() {
    return this.filterStatus === 'All'
      ? this.mockSales
      : this.mockSales.filter(s => s.status === this.filterStatus);
  }

  setFilterStatus(status: PaymentStatus | 'All' ) {
    this.filterStatus = status;
  }

  get stats() {
    return {
      total: this.mockSales.reduce((sum, sale) => sum + sale.finalPrice, 0),
      pending: this.mockSales.filter(s => s.status === 'Pending').length,
      confirmed: this.mockSales.filter(s => s.status === 'Confirmed').length,
      disputes: this.mockSales.filter(s => s.status === 'Dispute').length
    };
  }
}

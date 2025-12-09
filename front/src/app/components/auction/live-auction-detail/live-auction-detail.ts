import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../../../models/auction.models';
import { Bid } from '../../../models/auction.models';
import { Router } from '@angular/router';
import { Input } from '@angular/core';

@Component({
  selector: 'app-live-auction-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './live-auction-detail.html',
  styleUrl: './live-auction-detail.css',
})
export class LiveAuctionDetail {

  constructor(private router:Router){

  }
  currentItemIndex = 0;

  @Input() isAdmin: boolean = false;
  @Input() connectedUsers: number = 47;

  
  items: Item[] = [
    { id: 1, name: 'Pintura al Óleo', description: 'Obra de arte abstracto', currentBid: 5000, bids: 12 },
    { id: 2, name: 'Escultura de Bronce', description: 'Figura clásica', currentBid: 8500, bids: 8 },
    { id: 3, name: 'Fotografía Vintage', description: 'Edición limitada', currentBid: 2300, bids: 15 },
  ];

  bidHistory: Bid[] = [
    { id: 1, user: 'Usuario123', amount: 5000, time: '14:23:15' },
    { id: 2, user: 'Coleccionista456', amount: 4800, time: '14:22:45' },
    { id: 3, user: 'ArtLover789', amount: 4500, time: '14:21:30' },
    { id: 4, user: 'Usuario123', amount: 4200, time: '14:20:10' },
  ];

  get currentItem(): Item {
    return this.items[this.currentItemIndex];
  }

  nextItem() {
    if (this.currentItemIndex < this.items.length - 1) {
      this.currentItemIndex++;
    }
  }

  previousItem() {
    if (this.currentItemIndex > 0) {
      this.currentItemIndex--;
    }
  }

  goBack(){
    this.router.navigate(["/dashboard"])
  }


  

  chatMessages: any[] = [];
 
  bidAmount = 0;
  chatMessage = '';

  onBack() {
    console.log('Volver atrás');
  }

  placeBid() {
    if (this.bidAmount <= this.currentItem.currentBid) return;

    this.currentItem.currentBid = this.bidAmount;
    this.currentItem.bids++;

    this.bidHistory.unshift({
      id: Date.now(),
      user: 'Tú',
      amount: this.bidAmount,
      time: new Date().toLocaleTimeString()
    });

    this.chatMessages.push({
      id: Date.now(),
      type: 'bid',
      user: 'Tú',
      amount: this.bidAmount,
      time: new Date().toLocaleTimeString()
    });

    this.bidAmount = 0;
  }

  sendMessage() {
    if (!this.chatMessage.trim()) return;

    this.chatMessages.push({
      id: Date.now(),
      type: 'message',
      user: 'Tú',
      message: this.chatMessage,
      time: new Date().toLocaleTimeString()
    });

    this.chatMessage = '';
  }

  awardItem() {
    alert(`Item adjudicado!`);
  }
}

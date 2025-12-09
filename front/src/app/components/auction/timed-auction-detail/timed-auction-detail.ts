import { Component } from '@angular/core';
import { Item, Activity } from '../../../models/auction.models';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-timed-auction-detail',
  imports: [CommonModule],
  templateUrl: './timed-auction-detail.html',
  styleUrl: './timed-auction-detail.css',
})
export class TimedAuctionDetail {
   

  activity: Activity[] = [
    { user: 'Usuario456', itemName: 'Reloj Omega Vintage', amount: 12000, timeAgo: 'Hace 2 minutos' },
    { user: 'Coleccionista789', itemName: 'Jarrón Ming', amount: 25000, timeAgo: 'Hace 15 minutos' },
    { user: 'ArtLover123', itemName: 'Joyería Art Deco', amount: 18000, timeAgo: 'Hace 32 minutos' },
  ];

  auctionStart = '10 Dic 2025, 10:00';
  auctionEnd = '15 Dic 2025, 18:00';
  timeRemaining = '2 días 5 horas 30 minutos';
}

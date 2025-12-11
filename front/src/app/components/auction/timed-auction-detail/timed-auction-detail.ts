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
   items: any[] = [
    { id: 1, name: 'Reloj Omega Vintage', description: 'Modelo Seamaster de 1965', bids: 23, timeLeft: '2d 5h 30m' },
    { id: 2, name: 'Jarrón Ming', description: 'Dinastía Ming, siglo XVI', bids: 45, timeLeft: '2d 5h 30m' },
    { id: 3, name: 'Manuscrito Original', description: 'Carta firmada de 1890', bids: 12, timeLeft: '2d 5h 30m' },
    { id: 4, name: 'Joyería Art Deco', description: 'Collar de diamantes', bids: 34, timeLeft: '2d 5h 30m' },
  ];

  activity: Activity[] = [
    { user: 'Usuario456', itemName: 'Reloj Omega Vintage', amount: 12000, timeAgo: 'Hace 2 minutos' },
    { user: 'Coleccionista789', itemName: 'Jarrón Ming', amount: 25000, timeAgo: 'Hace 15 minutos' },
    { user: 'ArtLover123', itemName: 'Joyería Art Deco', amount: 18000, timeAgo: 'Hace 32 minutos' },
  ];

  auctionStart = '10 Dic 2025, 10:00';
  auctionEnd = '15 Dic 2025, 18:00';
  timeRemaining = '2 días 5 horas 30 minutos';
}

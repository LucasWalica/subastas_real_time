import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { ChatMessage, PaymentStatus } from '../../../models/auction.models';
@Component({
  selector: 'app-transaction-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-chat.html',
  styleUrl: './transaction-chat.css',
})
export class TransactionChat {
  @Input() userRole: 'buyer' | 'seller' = 'buyer';

  newMessage = '';
  paymentStatus: PaymentStatus = 'Paid';

  mockTransaction = {
    itemName: 'Pintura al Óleo - Abstracto Moderno',
    finalPrice: 5000,
    buyerName: 'Usuario123',
    sellerName: 'Galería Arte Pro',
    date: '10 Dic 2025',
    status: 'Paid' as PaymentStatus,
  };

  mockMessages: ChatMessage[] = [
    { id: 1, sender: 'buyer', message: '¡Hola!...', time: '14:30', date: '10 Dic' },
    { id: 2, sender: 'seller', message: 'Hola! Felicidades...', time: '14:32', date: '10 Dic' },
    { id: 3, sender: 'seller', message: 'Cuenta: ES12...', time: '14:33', date: '10 Dic' },
    { id: 4, sender: 'buyer', message: 'Perfecto...', time: '15:45', date: '10 Dic' },
    { id: 5, sender: 'system', message: 'El comprador ha marcado el pago...', time: '15:46', date: '10 Dic' },
  ];

  setPaymentStatus(status: PaymentStatus) {
    this.paymentStatus = status;
  }

  onSend() {
    if (!this.newMessage.trim()) return;

    this.mockMessages.push({
      id: Date.now(),
      sender: this.userRole,
      message: this.newMessage,
      time: 'Ahora',
      date: 'Hoy'
    });

    this.newMessage = '';
  }

  onBack() {
    console.log('Volver');
  }

}

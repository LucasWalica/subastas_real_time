import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { ChatPreview } from '../../../models/auction.models';
import { CommonModule } from '@angular/common';
import { Navbar } from "../../reusable/navbar/navbar";
@Component({
  selector: 'app-chatlit',
  imports: [CommonModule, Navbar],
  templateUrl: './chatlit.html',
  styleUrl: './chatlit.css',
})
export class Chatlit {

  mockChats: ChatPreview[] = [
    {
      id: 1,
      itemName: 'Pintura al Óleo - Abstracto Moderno',
      otherParty: 'Galería Arte Pro',
      lastMessage: 'El comprador ha marcado el pago como realizado',
      timestamp: 'Hace 1h',
      unread: 2,
      role: 'buyer',
      status: 'Paid',
    }
  ];
  @Input() chats: ChatPreview[] = [];

  @Output() navigateToBrowse = new EventEmitter<void>();
  @Output() navigateToDashboard = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  @Output() openChat = new EventEmitter<{ chatId: number; role: 'buyer' | 'seller' }>();

  getStatusColor(status: string) {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Dispute':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  onChatClick(chat: ChatPreview) {
    this.openChat.emit({ chatId: chat.id, role: chat.role });
  }
}

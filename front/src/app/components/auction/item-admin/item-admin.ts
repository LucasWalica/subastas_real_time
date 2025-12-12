import { Component } from '@angular/core';
import { Item } from '../../../models/auction.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from "../../reusable/navbar/navbar";
@Component({
  selector: 'app-item-admin',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './item-admin.html',
  styleUrl: './item-admin.css',
})
export class ItemAdmin {
  items: Item[] = [
    { 
      id: 1, 
      name: 'Pintura al Óleo Abstracta', 
      description: 'Obra original de artista contemporáneo', 
      img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
      created_at: '2025-12-01'
    },
    { 
      id: 2, 
      name: 'Reloj Vintage Omega', 
      description: 'Reloj de colección en excelente estado', 
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      created_at: '2025-12-03'
    },
    { 
      id: 3, 
      name: 'Escultura de Bronce', 
      description: 'Escultura artesanal firmada', 
      img: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=400',
      created_at: '2025-12-05'
    },
  ];

  showModal = false;
  editingItem: Item | null = null;

  formData = {
    name: '',
    description: '',
    img: '',
    starting_price: ''
  };

  openCreateModal() {
    this.editingItem = null;
    this.formData = { name: '', description: '', img: '', starting_price: '' };
    this.showModal = true;
  }

  openEditModal(item: Item) {
    this.editingItem = item;
    this.formData = {
      name: item.name,
      description: item.description,
      img: item.img,
      starting_price: item.starting_price?.toString()??""
    };
    this.showModal = true;
  }

  handleSave() {
    if (!this.formData.name || !this.formData.starting_price) return;

    if (this.editingItem) {
      // editar item
      this.items = this.items.map(i =>
        i.id === this.editingItem!.id
          ? { 
              ...i,
              ...this.formData,
              starting_price: parseInt(this.formData.starting_price)
            }
          : i
      );
    } else {
      // nuevo item
      const newItem: Item = {
        id: Math.max(0, ...this.items.map(i => i.id)) + 1,
        name: this.formData.name,
        description: this.formData.description,
        img: this.formData.img,
        starting_price: parseInt(this.formData.starting_price),
        created_at: new Date().toISOString().split('T')[0]
      };
      this.items.push(newItem);
    }

    this.showModal = false;
  }

  handleDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar este item?')) {
      this.items = this.items.filter(i => i.id !== id);
    }
  }
}

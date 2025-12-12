import { Component } from '@angular/core';
import { Item } from '../../../models/auction.models';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { Navbar } from "../../reusable/navbar/navbar";
import { Auction } from '../../../services/auction';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-item-admin',
  imports: [
    CommonModule, 
    FormsModule, 
    Navbar, 
    ReactiveFormsModule
  ],
  templateUrl: './item-admin.html',
  styleUrl: './item-admin.css',
})
export class ItemAdmin {
    
  items: Item[] = [];
  showModal = false;
  editingItem: Item | null = null;

  itemForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private auctionService: Auction,
    private fb: FormBuilder
  ) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      starting_price: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.auctionService.getOwnitems().subscribe({
      next: (res) => (this.items = res),
      error: (err) => console.error(err),
    });
  }

  previewImage: string | ArrayBuffer | null = null;

  // Captura del archivo desde el input
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.previewImage = null;
    }
  }

  openCreateModal() {
    this.editingItem = null;
    this.itemForm.reset({
      name: '',
      description: '',
      starting_price: 0,
    });
    this.selectedFile = null;
    this.showModal = true;
  }

  openEditModal(item: Item) {
    this.editingItem = item;
    this.itemForm.setValue({
      name: item.name,
      description: item.description,
      starting_price: item.starting_price,
    });

    // No permitimos editar imagen (por ahora)
    this.selectedFile = null;
    this.showModal = true;
  }

  handleSave() {
    if (this.itemForm.invalid) return;

    if (this.editingItem) {
      // === UPDATE (sin imagen nueva) ===
      this.auctionService.updateItem(this.editingItem.id!, this.itemForm.value).subscribe({
        next: () => {
          this.showModal = false;
          this.loadItems();
        },
        error: (err) => console.error(err),
      });

    } else {
      // === CREATE (requiere FormData) ===
      const formData = new FormData();
      formData.append('name', this.itemForm.value.name);
      formData.append('description', this.itemForm.value.description);
      formData.append('starting_price', this.itemForm.value.starting_price);

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.auctionService.createNewItem(formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadItems();
        },
        error: (err) => console.error(err),
      });
    }
  }

  handleDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar este item?')) return;

    this.auctionService.deleteItem(id).subscribe({
      next: () => this.loadItems(),
      error: (err) => console.error(err),
    });
  }
}

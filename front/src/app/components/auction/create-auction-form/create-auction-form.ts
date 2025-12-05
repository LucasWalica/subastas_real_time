import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Navbar } from '../../reusable/navbar/navbar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-auction-form',
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  templateUrl: './create-auction-form.html',
  styleUrl: './create-auction-form.css',
})
export class CreateAuctionForm {
  auctionForm!: FormGroup;
  categories = [
    'Arte y Antigüedades',
    'Tecnología',
    'Joyería',
    'Vehículos',
    'Muebles',
    'Coleccionables',
    'Ropa y Accesorios',
    'Deportes',
  ];

  constructor(private fb: FormBuilder, private router:Router) {}

  ngOnInit(): void {
    this.auctionForm = this.fb.group({
      title: ['', [Validators.required]],
      category: ['', Validators.required],
      description: ['', Validators.required],
      auctionType: ['timed', Validators.required],
      startDate: [''],
      endDate: [''],
      items: this.fb.array([this.createItem()])
    });
  }

  get items(): FormArray {
    return this.auctionForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startingBid: ['', [Validators.required, Validators.min(1)]],
      image: ['']
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  saveAuction() {
    if (this.auctionForm.valid) {
      console.log(this.auctionForm.value);
      // aquí podrías llamar a HouseService para guardar
    } else {
      this.auctionForm.markAllAsTouched();
    }
  }

  goBack(){
    this.router.navigate(["/dashboard"])
  }
}

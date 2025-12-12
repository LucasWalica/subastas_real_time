import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from './env.api';
import { HttpClient } from '@angular/common/http';
import { Item, Bid, ItemGranted } from '../models/auction.models';
@Injectable({
  providedIn: 'root',
})
export class Auction {
  apiUrl = apiUrl + "api/auctions/";

  constructor(private http: HttpClient) {}

  /* Items */
  getOwnitems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl + 'items/', { withCredentials: true });
  }
  createNewItem(data: FormData) {
    return this.http.post(`${this.apiUrl}items/create/`, data, { withCredentials: true });
  }

  deleteItem(itemId:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl + `items/${itemId}/delete/`, { withCredentials: true });
  }
  updateItem(itemId:number, item:Item):Observable<any>{
    return this.http.put<any>(this.apiUrl + `items/${itemId}/update/`, item, { withCredentials: true });
  }
  /* Auctions */
  getOwnAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(this.apiUrl + 'auctions/owner/', { withCredentials: true });
  }
  getAuctionList(): Observable<Auction[]> {
    return this.http.get<Auction[]>(this.apiUrl + 'auctions/', { withCredentials: true });
  }
  updateAuction(auctionId:number, auction:Auction):Observable<any>{
    return this.http.put<any>(this.apiUrl + `auctions/${auctionId}/update/`, auction, { withCredentials: true });
  }
  deleteAuction(auctionId:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl + `auctions/${auctionId}/delete/`, { withCredentials: true });
  }
  /* Bids for timed auctions*/
  bidListForItem(auctionItemId:number):Observable<Bid[]>{
    return this.http.get<Bid[]>(this.apiUrl + `bids/${auctionItemId}/`, { withCredentials: true });
  }
  placeBid(auctionItemId: number, amount: number): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + 'bids/create/',
      { auction_item: auctionItemId, amount: amount }, { withCredentials: true }
    );
  }
  /* Item Granted */
  grantedItemList():Observable<ItemGranted[]>{
    return this.http.get<ItemGranted[]>(this.apiUrl + 'granted/', { withCredentials: true });
  }

  /* upload image */
  uploadImage(file: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{url: string}>(this.apiUrl + "upload-image/", formData, { withCredentials: true });
  }


}

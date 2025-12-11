import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from './env.api';
import { HttpClient } from '@angular/common/http';
import { Item, Bid, ItemGranted } from '../models/auction.models';
@Injectable({
  providedIn: 'root',
})
export class Auction {
  apiUrl = apiUrl + "/api/auction/";

  constructor(private http: HttpClient) {}

  /* Items */
  getOwnitems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl + 'items/own/');
  }
  createNewItem(item:Item):Observable<any>{
    return this.http.post<any>(this.apiUrl + 'items/create/', item);
  }
  deleteItem(itemId:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl + `items/${itemId}/delete/`);
  }
  updateItem(itemId:number, item:Item):Observable<any>{
    return this.http.put<any>(this.apiUrl + `items/${itemId}/update/`, item);
  }
  /* Auctions */
  getOwnAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(this.apiUrl + 'auctions/owner/');
  }
  getAuctionList(): Observable<Auction[]> {
    return this.http.get<Auction[]>(this.apiUrl + 'auctions/');
  }
  updateAuction(auctionId:number, auction:Auction):Observable<any>{
    return this.http.put<any>(this.apiUrl + `auctions/${auctionId}/update/`, auction);
  }
  deleteAuction(auctionId:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl + `auctions/${auctionId}/delete/`);
  }
  /* Bids for timed auctions*/
  bidListForItem(auctionItemId:number):Observable<Bid[]>{
    return this.http.get<Bid[]>(this.apiUrl + `bids/${auctionItemId}/`);
  }
  placeBid(auctionItemId: number, amount: number): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + 'bids/create/',
      { auction_item: auctionItemId, amount: amount }
    );
  }


  /* Item Granted */
  grantedItemList():Observable<ItemGranted[]>{
    return this.http.get<ItemGranted[]>(this.apiUrl + 'granted/');
  }

}

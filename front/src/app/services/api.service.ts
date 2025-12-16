import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // -------------------
  // Items
  // -------------------
  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auctions/items/`);
  }

  createItem(itemData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auctions/items/create/`, itemData);
  }

  deleteItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auctions/items/${itemId}/delete/`);
  }

  updateItem(itemId: number, itemData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auctions/items/${itemId}/update/`, itemData);
  }

  // -------------------
  // Auctions
  // -------------------
  getActiveAuctions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auctions/auctions/`);
  }

  getAuctionsByOwner(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auctions/auctions/owner/`);
  }

  createAuction(auctionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auctions/auctions/create/`, auctionData);
  }

  updateAuction(auctionId: number, auctionData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auctions/auctions/${auctionId}/update/`, auctionData);
  }

  deleteAuction(auctionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auctions/auctions/${auctionId}/delete/`);
  }

  // -------------------
  // Bids
  // -------------------
  getBids(auctionItemId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/auctions/bids/${auctionItemId}/`);
  }

  placeBid(auctionItemId: number, bidData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auctions/bids/${auctionItemId}/place-bid/`, bidData);
  }

  // -------------------
  // Items Granted
  // -------------------
  getGrantedItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auctions/granted/`);
  }

  // -------------------
  // WebRTC
  // -------------------
  getWebRTCICEServers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auctions/webrtc/ice-servers/`);
  }

  // -------------------
  // User
  // -------------------
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login/`, credentials);
  }

  register(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/register/`, userInfo);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/logout/`, {});
  }
}

import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private auctionSocket: WebSocketSubject<any> | undefined;
  private webrtcSocket: WebSocketSubject<any> | undefined;

  constructor() { }

  connectAuction(auctionId: number) {
    if (!this.auctionSocket || this.auctionSocket.closed) {
      this.auctionSocket = webSocket(`ws://localhost:8000/ws/auction/${auctionId}/`);
    }
    return this.auctionSocket.asObservable();
  }

  connectWebRTC(auctionId: number) {
    if (!this.webrtcSocket || this.webrtcSocket.closed) {
      this.webrtcSocket = webSocket(`ws://localhost:8000/ws/webrtc/${auctionId}/`);
    }
    return this.webrtcSocket.asObservable();
  }

  sendAuctionMessage(message: any) {
    if (this.auctionSocket) {
      this.auctionSocket.next(message);
    }
  }

  sendWebRTCMessage(message: any) {
    if (this.webrtcSocket) {
      this.webrtcSocket.next(message);
    }
  }

  closeAuctionConnection() {
    if (this.auctionSocket) {
      this.auctionSocket.complete();
    }
  }

  closeWebRTCConnection() {
    if (this.webrtcSocket) {
      this.webrtcSocket.complete();
    }
  }
}

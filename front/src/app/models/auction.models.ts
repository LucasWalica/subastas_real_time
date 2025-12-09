// provisional model, still not conected to backend
// just adding fields for display purposes
export interface Auction {
  id: number;
  owner?:any;
  title: string;
  type: 'live' | 'timed';
  category: string;
  items: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  currentBid?:number;
  participants?:number;
}


export interface Item {
  id: number;
  name: string;
  description: string;
  currentBid: number;
  bids: number;
  timeLeft?:string;
}

export interface Bid {
  id: number;
  user: string;
  amount: number;
  time: string;
}

export interface Activity {
  user: string;
  itemName: string;
  amount: number;
  timeAgo: string;
}

export interface ChatPreview {
  id: number;
  itemName: string;
  otherParty: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  role: 'buyer' | 'seller';
  status: 'Pending' | 'Paid' | 'Confirmed' | 'Dispute';
}

export type PaymentStatus = 'Pending' | 'Paid' | 'Confirmed' | 'Dispute';

export interface ChatMessage {
  id: number;
  sender: 'buyer' | 'seller' | 'system';
  message: string;
  time: string;
  date: string;
}


export interface Sale {
  id: number;
  itemName: string;
  itemImage: string;
  winnerName: string;
  finalPrice: number;
  auctionDate: string;
  status: PaymentStatus;
}
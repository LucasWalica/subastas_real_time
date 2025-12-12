// provisional model, still not conected to backend
// just adding fields for display purposes
export interface Auction {
  id: number;
  owner?:any;
  title: string;
  type: 'live' | 'timed';
  category: string;
  itemsNumber: number;
  items: AuctionItem[];
  status?: string;
  startDate?: string;
  endDate?: string;
  currentBid?:number;
  participants?:number;
}
/*change this because we are going to use a serializer*/
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
  last_login?: string;
  date_joined: string;
  token_balance: number;
  is_banned: boolean;
  created_at: string;
}

export interface Item {
  id?: number;
  owner?:User;
  starting_price?:number;
  name: string;
  description: string;
  img: string;
  created_at?: string;
}

export interface AuctionItem {
  auction: Auction;
  item: Item;
  starting_price: number;
  currentBid: number; 
  is_awarded:boolean;
}

export interface Bid {
  id: number;
  auction_item: AuctionItem;
  userId: number;
  amount: number;
  created_at: string;
}

// dont need this interface for now i guess 
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


export interface ItemGranted {
  id: number;
  auction_item: AuctionItem;
  winner: User;
  amount: number;
  granted_at: string;
  status: PaymentStatus;
}
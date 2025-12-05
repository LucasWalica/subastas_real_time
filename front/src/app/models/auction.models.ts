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
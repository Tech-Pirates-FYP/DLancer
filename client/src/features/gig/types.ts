export interface Proposal {
    _id: string;
    freelancerAddress: string;
    file: string;
    status: "pending" | "accepted" | "rejected";
}

export interface Gig {
    walletAddress: string;
    title: string;
    description: string;
    category: string;
    deliveryTime: number;
    revisions?: number;
    features: string[];
    price: number;
    shortDesc?: string;
    images?: string[];
    freelancerAddress?: string;
    proposals?: Proposal[];
    status: 'pending' | 'assigned' | 'completed';
  }
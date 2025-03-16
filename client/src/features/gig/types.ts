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
    createdAt?: Date;
    images?: string[];
    freelancerAddress?: string;
    proposals?: Proposal[];
    status: 'pending' | 'assigned' | 'completed';
  }

export interface FreelancerProposal {
    proposalId: string,
    gigTitle: string,
    gigCategory: string,
    gigPrice: number,
    clientAddress: string,
    status: "pending" | "accepted" | "rejected";
    file: string
} 
export interface Job {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    skills: string[];
    postedDate: string;
    deadline: string;
    clientId: string;
  }
  
  export interface Profile {
    id: string;
    name: string;
    title: string;
    hourlyRate: number;
    rating: number;
    skills: string[];
    completedJobs: number;
    avatar: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    icon: string;
  }

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
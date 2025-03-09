import mongoose, { Schema, Document } from "mongoose";

export interface IProposal extends Document {
  _id: string;
  freelancerAddress: string;
  file: string;
  status: "pending" | "accepted" | "rejected";
}

export interface IGig extends Document {
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
  proposals?: IProposal[];
  status: 'pending' | 'assigned' | 'completed';
}

const ProposalSchema = new Schema({
  freelancerAddress: { type: String, required: true },
  file: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});

const GigSchema = new Schema<IGig>(
  {
    walletAddress: { type: String, requied: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    deliveryTime: { type: Number, required: true },
    revisions: { type: Number, required: true },
    features: { type: [String], required: true },
    price: { type: Number, required: true },
    shortDesc: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    images: { type: [String], required: true },
    freelancerAddress: { type: String, default: null },
    proposals: { type: [ProposalSchema], default: [] },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'completed'],
      default: 'pending'
    },
  },
  { timestamps: true }
);

export const Gig = mongoose.model<IGig>("Gig", GigSchema);

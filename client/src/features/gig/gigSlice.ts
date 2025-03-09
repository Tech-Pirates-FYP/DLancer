import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gig } from "./types";

const initialState: Gig = {
    walletAddress: "",
    title: "",
    description: "",
    category: "",
    deliveryTime: 0,
    revisions: 0,
    features: [],
    price: 0,
    shortDesc: "",
    images: [],
    freelancerAddress: undefined,
    proposals: [],
    status: "pending",
};

const gigSlice = createSlice({
    name: "gig",
    initialState,
    reducers: {
        setGigData: (state, action: PayloadAction<Partial<Gig>>) => {
            return { ...state, ...action.payload };
        },
        resetGigData: () => initialState,
    }
})

export const { setGigData, resetGigData } = gigSlice.actions;
export default gigSlice.reducer;
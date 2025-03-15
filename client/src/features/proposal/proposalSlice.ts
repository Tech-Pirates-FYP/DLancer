import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Proposal {
    _id: string;
    freelancerAddress: string;
    file: string;
    status: "pending" | "accepted" | "rejected";
}

const initialState: Proposal = {
    _id: "",
    freelancerAddress: "",
    file: "",
    status: "pending"
};

const proposalSlice = createSlice({
    name: "proposal",
    initialState,
    reducers: {
        setFreelancerAddress: (state, action: PayloadAction<string>) => {
            state.freelancerAddress = action.payload;
        },
        setFile: (state, action: PayloadAction<string>) => {
            state.file = action.payload;
        },
        resetProposalForm: () => initialState,
    }
});

export const { setFreelancerAddress, setFile, resetProposalForm } = proposalSlice.actions;
export default proposalSlice.reducer;

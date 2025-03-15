import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Gig, Proposal } from "./types";

export const gigAPI = createApi ({
    reducerPath: "gigAPI",
    baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:9999/api/gig`}),
    endpoints: (builder) => ({

        getGigsByWallet: builder.query<Gig[], string>({
          query: (walletAddress) => `/client/${walletAddress}`,
        }),

        getAllGigs: builder.query<Gig[], void>({
          query: () => `/`
        }),

        getGigById: builder.query<Gig, string> ({
          query: (gigId) => `/${gigId}`
        }),
        
        createGig: builder.mutation({
          query: (gigData) => ({
            url: `/addGig`,
            method: "POST",
            body: gigData,
          })
        }),

        submitProposal: builder.mutation<Proposal, { gigId: string; freelancerAddress: string; file: string }>({
          query: ({ gigId, freelancerAddress, file }) => ({
              url: `/${gigId}/submitProposal`,
              method: "POST",
              body: { freelancerAddress, file },
              headers: {
                  "Content-Type": "application/json",
              },
          }),
        }),
    }),
})

export const { useGetGigsByWalletQuery, useCreateGigMutation, useGetGigByIdQuery, useGetAllGigsQuery, useSubmitProposalMutation  } = gigAPI;
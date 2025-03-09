import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Gig } from "./types";

export const gigAPI = createApi ({
    reducerPath: "gigAPI",
    // baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/gig/client`}),
    baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:9999/api/gig`}),
    endpoints: (builder) => ({

        getGigsByWallet: builder.query<Gig[], string>({
          query: (walletAddress) => `/client/${walletAddress}`,
        }),
        
        createGig: builder.mutation({
          query: (gigData) => ({
            url: "/addGig",
            method: "POST",
            body: gigData,
          })
        })
    }),
})

export const { useGetGigsByWalletQuery, useCreateGigMutation  } = gigAPI;
import { baseApi } from "./baseApi";

export const corporateClientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCorporateClients: builder.query({
      query: (params) => {
        return {
          url: "/corporate-clients",
          method: "GET",
          params,
        };
      },
      providesTags: ["corporateClients"],
    }),

    getSingleCorporateClient: builder.query({
      query: (id) => {
        return {
          url: `/corporate-clients/${id}`,
          method: "GET",
        };
      },
      providesTags: ["corporateClient"],
    }),

    createCorporateClient: builder.mutation({
      query: (formData) => {
        return {
          url: "/corporate-clients/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["corporateClients"],
    }),

    updateCorporateClient: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `/corporate-clients/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["corporateClients", "corporateClient"],
    }),

    deleteCorporateClient: builder.mutation({
      query: (id) => {
        return {
          url: `/corporate-clients/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["corporateClients"],
    }),

    // Reorder corporate clients (Admin only)
    reorderCorporateClients: builder.mutation({
      query: ({ clientIds }) => {
        return {
          url: "/corporate-clients/reorder",
          method: "PATCH",
          body: { clientIds },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["corporateClients"],
    }),

    // Public API for frontend
    getPublicCorporateClients: builder.query({
      query: () => {
        return {
          url: "/corporate-clients/public/all",
          method: "GET",
        };
      },
      providesTags: ["publicCorporateClients"],
    }),
  }),
});

export const {
  useGetCorporateClientsQuery,
  useGetSingleCorporateClientQuery,
  useCreateCorporateClientMutation,
  useUpdateCorporateClientMutation,
  useDeleteCorporateClientMutation,
  useReorderCorporateClientsMutation,
  useGetPublicCorporateClientsQuery,
} = corporateClientsApi;

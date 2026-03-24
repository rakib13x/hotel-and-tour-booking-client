import {
  CreateVisaBookingQueryInput,
  UpdateVisaBookingQueryStatusInput,
  VisaBookingQuery,
  VisaBookingQueryStats,
} from "@/types/visaBookingQuery";
import { baseApi } from "../../baseApi";

export interface VisaBookingQueryResponse {
  success: boolean;
  message: string;
  data: VisaBookingQuery;
}

export interface VisaBookingQueryListResponse {
  success: boolean;
  message: string;
  data: VisaBookingQuery[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
    next?: number;
    prev?: number;
  };
}

export interface VisaBookingQueryStatsResponse {
  success: boolean;
  message: string;
  data: VisaBookingQueryStats;
}

export interface VisaApplicationResponse {
  success: boolean;
  message: string;
  data: {
    applicationId: string;
    transactionId: string;
    paymentUrl: string;
    sessionKey: string;
    application: {
      country: string;
      visaType: string;
      name: string;
      processingFee: number;
      paymentStatus: string;
    };
  };
}

export interface CreateVisaApplicationInput {
  country: string;
  visaType: string;
  type?: "application";
  name: string;
  email?: string | undefined;
  phone: string;
  processingFee: number;
}

export const visaBookingQueryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create visa booking query (Query type - no payment)
    createVisaBookingQuery: builder.mutation<
      VisaBookingQueryResponse,
      CreateVisaBookingQueryInput
    >({
      query: (data) => ({
        url: "/visa-booking-queries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["visaBookingQueries", "visaBookingQueryStats"],
    }),

    // Create visa application (Application type - with payment)
    createVisaApplication: builder.mutation<
      VisaApplicationResponse,
      CreateVisaApplicationInput
    >({
      query: (data) => ({
        url: "/visa-booking-queries/apply",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["visaBookingQueries", "visaBookingQueryStats"],
    }),

    // Get all visa booking queries (Admin only)
    getVisaBookingQueries: builder.query<
      VisaBookingQueryListResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        type?: string;
        country?: string;
      }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.status) queryParams.append("status", params.status);
        if (params.type) queryParams.append("type", params.type);
        if (params.country) queryParams.append("country", params.country);

        return {
          url: `/visa-booking-queries?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["visaBookingQueries"],
    }),

    // Get visa booking query by ID (Admin only)
    getVisaBookingQueryById: builder.query<VisaBookingQueryResponse, string>({
      query: (id) => ({
        url: `/visa-booking-queries/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "visaBookingQueries", id }],
    }),

    // Update visa booking query status (Admin only)
    updateVisaBookingQueryStatus: builder.mutation<
      VisaBookingQueryResponse,
      {
        id: string;
        data: UpdateVisaBookingQueryStatusInput;
      }
    >({
      query: ({ id, data }) => ({
        url: `/visa-booking-queries/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "visaBookingQueries", id },
        "visaBookingQueries",
        "visaBookingQueryStats",
      ],
    }),

    // Delete visa booking query (Admin only)
    deleteVisaBookingQuery: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/visa-booking-queries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["visaBookingQueries", "visaBookingQueryStats"],
    }),

    // Get statistics (Admin only)
    getVisaBookingQueryStats: builder.query<
      VisaBookingQueryStatsResponse,
      void
    >({
      query: () => ({
        url: "/visa-booking-queries/stats",
        method: "GET",
      }),
      providesTags: ["visaBookingQueries", "visaBookingQueryStats"],
    }),

    // Get user's own visa booking queries (User only)
    getMyVisaBookingQueries: builder.query<
      { success: boolean; message: string; data: VisaBookingQuery[] },
      void
    >({
      query: () => ({
        url: "/visa-booking-queries/my-queries",
        method: "GET",
      }),
      providesTags: ["visaBookingQueries"],
    }),
  }),
});

export const {
  useCreateVisaBookingQueryMutation,
  useCreateVisaApplicationMutation,
  useGetVisaBookingQueriesQuery,
  useGetVisaBookingQueryByIdQuery,
  useUpdateVisaBookingQueryStatusMutation,
  useDeleteVisaBookingQueryMutation,
  useGetVisaBookingQueryStatsQuery,
  useGetMyVisaBookingQueriesQuery,
} = visaBookingQueryApi;

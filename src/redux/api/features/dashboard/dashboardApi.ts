import { baseApi } from "../../baseApi";

export interface DashboardStats {
  users: {
    total: number;
    recent: number;
  };
  queries: {
    total: number;
    recent: number;
  };
  reviews: {
    total: number;
    recent: number;
  };
  blogs: {
    total: number;
    recent: number;
  };
  team: {
    total: number;
    recent: number;
  };
  contacts: {
    total: number;
    recent: number;
  };
  visas: {
    total: number;
    recent: number;
  };
  gallery: {
    total: number;
    recent: number;
  };
  banners: {
    total: number;
  };
  tours: {
    total: number;
    recent: number;
  };
  faqs: {
    total: number;
    active: number;
  };
  corporateClients: {
    total: number;
    recent: number;
  };
  customTourQueries: {
    total: number;
    recent: number;
  };
  bookings?: {
    total: number;
    recent: number;
  };
}

export interface UserDashboardStats {
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
  };
  queries: {
    total: number;
  };
  visaQueries: {
    total: number;
    pending: number;
  };
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

export interface UserDashboardStatsResponse {
  success: boolean;
  message: string;
  data: UserDashboardStats;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
    }),

    getUserDashboardStats: builder.query<UserDashboardStatsResponse, void>({
      query: () => ({
        url: "/dashboard/user-stats",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetUserDashboardStatsQuery } =
  dashboardApi;

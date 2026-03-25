import { baseApi } from "../../baseApi";

interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  profileImg?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User Management
    deleteUser: builder.mutation({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
    }),

    getSingleUser: builder.query({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
    }),

    // Legacy endpoints (keeping for backward compatibility)
    changeProfile: builder.mutation({
      query: (userInfo) => ({
        url: `/users/update-profile/${userInfo.id}`,
        method: "PATCH",
        body: userInfo.data,
      }),
    }),
    changeCover: builder.mutation({
      query: (userInfo) => ({
        url: `/users/update-cover/${userInfo.id}`,
        method: "PATCH",
        body: userInfo.data,
      }),
    }),
  }),
});

export const {
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useChangeCoverMutation,
  useChangeProfileMutation,
} = userApi;

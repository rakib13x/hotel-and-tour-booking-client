import { TUser } from "@/types";
import { setUser } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
import { baseApi } from "../../baseApi";

// Auth API interfaces
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: TUser;
  token: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  profileImg?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Auth API endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // Login user
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation<
      { success: boolean; data: { accessToken: string } },
      void
    >({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),

    // Forget password
    forgetPassword: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: userInfo,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: ({ resetPasswordData, token }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetPasswordData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // Update profile
    updateProfile: builder.mutation({
      query: (profileData: UpdateProfileData) => ({
        url: "/auth/update-profile",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["user"],
      async onQueryStarted(
        _profileData,
        { dispatch, queryFulfilled, getState }
      ) {
        try {
          const { data } = await queryFulfilled;
          // Update the auth state with the returned user data
          if (data?.data) {
            const state = getState() as RootState;
            const currentToken = state.auth?.token;
            dispatch(setUser({ user: data.data, token: currentToken }));
          }
        } catch {
          // Handle error if needed
        }
      },
    }),

    // Change password
    changePassword: builder.mutation({
      query: (passwordData: ChangePasswordData) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: passwordData,
      }),
    }),

    // Upload profile image
    uploadProfileImage: builder.mutation({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("profileImg", file);
        return {
          url: "/auth/upload-profile-image",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["user"],
      async onQueryStarted(_file, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          // Update the auth state with the returned user data
          if (data?.data) {
            const state = getState() as RootState;
            const currentToken = state.auth?.token;
            dispatch(setUser({ user: data.data, token: currentToken }));
          }
        } catch {
          // Handle error if needed
        }
      },
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadProfileImageMutation,
  useLogoutMutation,
} = authApi;

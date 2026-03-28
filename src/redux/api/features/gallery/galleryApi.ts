import { ICategory, IImage, ISubCategory } from "@/types/schemas";
import { baseApi } from "../../baseApi";

type GalleryQueryParams = Record<string, string | number | boolean | undefined>;

// Category API endpoints
export const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Category endpoints
    getGalleryCategories: builder.query<
      {
        data: ICategory[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      GalleryQueryParams
    >({
      query: (params) => ({
        url: "/gallery/categories",
        params,
      }),
      providesTags: ["galleryCategories"],
    }),

    getActiveGalleryCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: "/gallery/categories/active",
      }),
      providesTags: ["galleryCategories"],
    }),

    getSingleGalleryCategory: builder.query<ICategory, string>({
      query: (id) => ({
        url: `/gallery/categories/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "galleryCategories", id }],
    }),

    createGalleryCategory: builder.mutation<ICategory, FormData>({
      query: (data) => ({
        url: "/gallery/categories/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["galleryCategories"],
    }),

    updateGalleryCategory: builder.mutation<
      ICategory,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/gallery/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "galleryCategories", id },
        "galleryCategories",
      ],
    }),

    deleteGalleryCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/gallery/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["galleryCategories"],
    }),

    // SubCategory endpoints
    getGallerySubCategories: builder.query<
      {
        data: ISubCategory[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      GalleryQueryParams
    >({
      query: (params) => ({
        url: "/gallery/subcategories",
        params,
      }),
      providesTags: ["gallerySubCategories"],
    }),

    getGallerySubCategoriesByCategory: builder.query<ISubCategory[], string>({
      query: (categoryId) => ({
        url: `/gallery/subcategories/category/${categoryId}`,
      }),
      providesTags: (_, __, categoryId) => [
        { type: "gallerySubCategories", id: categoryId },
      ],
    }),

    getSingleGallerySubCategory: builder.query<ISubCategory, string>({
      query: (id) => ({
        url: `/gallery/subcategories/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "gallerySubCategories", id }],
    }),

    createGallerySubCategory: builder.mutation<ISubCategory, FormData>({
      query: (data) => ({
        url: "/gallery/subcategories/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["gallerySubCategories"],
    }),

    updateGallerySubCategory: builder.mutation<
      ISubCategory,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/gallery/subcategories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "gallerySubCategories", id },
        "gallerySubCategories",
      ],
    }),

    deleteGallerySubCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/gallery/subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gallerySubCategories"],
    }),

    // Image endpoints
    getGalleryImages: builder.query<
      {
        data: IImage[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      GalleryQueryParams
    >({
      query: (params) => ({
        url: "/gallery/images",
        params,
      }),
      providesTags: ["galleryImages"],
    }),

    getGalleryImagesBySubCategory: builder.query<IImage[], string>({
      query: (subCategoryId) => ({
        url: `/gallery/images/subcategory/${subCategoryId}`,
      }),
      providesTags: (_, __, subCategoryId) => [
        { type: "galleryImages", id: subCategoryId },
      ],
    }),

    getSingleGalleryImage: builder.query<IImage, string>({
      query: (id) => ({
        url: `/gallery/images/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "galleryImages", id }],
    }),

    createGalleryImage: builder.mutation<
      IImage,
      { image: File; subCategoryId: string; altText?: string }
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("image", data.image);
        formData.append("subCategoryId", data.subCategoryId);
        if (data.altText) {
          formData.append("altText", data.altText);
        }

        return {
          url: "/gallery/images/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["galleryImages"],
    }),

    updateGalleryImage: builder.mutation<
      IImage,
      {
        id: string;
        data: { subCategoryId?: string; altText?: string; isActive?: boolean };
      }
    >({
      query: ({ id, data }) => ({
        url: `/gallery/images/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "galleryImages", id },
        "galleryImages",
      ],
    }),

    deleteGalleryImage: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/gallery/images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["galleryImages"],
    }),
  }),
});

export const {
  // Category hooks
  useGetGalleryCategoriesQuery,
  useGetActiveGalleryCategoriesQuery,
  useGetSingleGalleryCategoryQuery,
  useCreateGalleryCategoryMutation,
  useUpdateGalleryCategoryMutation,
  useDeleteGalleryCategoryMutation,

  // SubCategory hooks
  useGetGallerySubCategoriesQuery,
  useGetGallerySubCategoriesByCategoryQuery,
  useGetSingleGallerySubCategoryQuery,
  useCreateGallerySubCategoryMutation,
  useUpdateGallerySubCategoryMutation,
  useDeleteGallerySubCategoryMutation,

  // Image hooks
  useGetGalleryImagesQuery,
  useGetGalleryImagesBySubCategoryQuery,
  useGetSingleGalleryImageQuery,
  useCreateGalleryImageMutation,
  useUpdateGalleryImageMutation,
  useDeleteGalleryImageMutation,
} = galleryApi;

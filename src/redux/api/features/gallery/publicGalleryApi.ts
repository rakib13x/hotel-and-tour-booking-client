import { ICategory, IImage, ISubCategory } from "@/types/schemas";
import { baseApi } from "../../baseApi";

// Public Gallery API endpoints for user interface
export const publicGalleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get active categories for public display
    getActiveGalleryCategories: builder.query<
      {
        success: boolean;
        message: string;
        data: ICategory[];
      },
      void
    >({
      query: () => ({
        url: "/gallery/categories/active",
      }),
      providesTags: ["galleryCategories"],
    }),

    // Get all subcategories for public display
    getAllGallerySubCategories: builder.query<
      {
        data: ISubCategory[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      any
    >({
      query: (params) => ({
        url: "/gallery/subcategories",
        params,
      }),
      providesTags: ["gallerySubCategories"],
    }),

    // Get subcategories by category for public display
    getGallerySubCategoriesByCategory: builder.query<
      {
        success: boolean;
        message: string;
        data: ISubCategory[];
      },
      string
    >({
      query: (categoryId) => ({
        url: `/gallery/subcategories/category/${categoryId}`,
      }),
      providesTags: (_, __, categoryId) => [
        { type: "gallerySubCategories", id: categoryId },
      ],
    }),

    // Get all images for public display
    getGalleryPublicImages: builder.query<
      {
        data: IImage[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      any
    >({
      query: (params) => ({
        url: "/gallery/images",
        params,
      }),
      providesTags: ["galleryImages"],
    }),

    // Get images by subcategory for public display
    getGalleryImagesBySubCategory: builder.query<
      {
        success: boolean;
        message: string;
        data: IImage[];
      },
      string
    >({
      query: (subCategoryId) => ({
        url: `/gallery/images/subcategory/${subCategoryId}`,
      }),
      providesTags: (_, __, subCategoryId) => [
        { type: "galleryImages", id: subCategoryId },
      ],
    }),

    // Get single image for public display
    getGallerySingleImage: builder.query<IImage, string>({
      query: (id) => ({
        url: `/gallery/images/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "galleryImages", id }],
    }),
  }),
});

export const {
  useGetActiveGalleryCategoriesQuery,
  useGetAllGallerySubCategoriesQuery,
  useGetGallerySubCategoriesByCategoryQuery,
  useGetGalleryPublicImagesQuery,
  useGetGalleryImagesBySubCategoryQuery,
  useGetGallerySingleImageQuery,
} = publicGalleryApi;

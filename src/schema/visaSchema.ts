import { z } from "zod";

// Match backend visa type enum
export const VISA_TYPES = ["tourist visa", "sticker visa", "e-visa"] as const;
export type VisaType = (typeof VISA_TYPES)[number];

export const createVisaSchema = z.object({
  countryName: z
    .string()
    .min(1, "Country name is required")
    .max(100, "Country name must be less than 100 characters")
    .trim(),
  visaTypes: z
    .array(z.enum(VISA_TYPES))
    .min(1, "At least one visa type is required")
    .max(3, "Maximum 3 visa types allowed"),
  processingFee: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Number(val)),
      "Processing fee must be a valid number"
    ),
  required_document: z.string().optional(),
});

export type CreateVisaFormData = z.infer<typeof createVisaSchema>;

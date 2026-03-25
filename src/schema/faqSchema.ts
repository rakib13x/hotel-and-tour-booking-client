import { z } from "zod";

export const createFaqSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question must not exceed 500 characters")
    .trim(),
  answer: z
    .string()
    .min(1, "Answer is required")
    .min(10, "Answer must be at least 10 characters")
    .max(2000, "Answer must not exceed 2000 characters")
    .trim(),
  orderIndex: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type CreateFaqFormData = z.infer<typeof createFaqSchema>;


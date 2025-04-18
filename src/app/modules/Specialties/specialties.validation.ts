import { z } from "zod";

const createSpecialtiesValidationSchema = z.object({
    title: z.string({ required_error: "Title is required!" })
});

const updateSpecialtiesValidationSchema = z.object({
    title: z.string().optional()
});

export const SpecialtiesValidation = {
    createSpecialtiesValidationSchema,
    updateSpecialtiesValidationSchema
}
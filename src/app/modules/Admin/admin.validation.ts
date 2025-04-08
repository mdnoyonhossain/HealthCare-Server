import { z } from "zod";

const updateAdminValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().min(10, "Contact number should have at least 10 digits").optional(),
    })
});

export const AdminValidation = {
    updateAdminValidationSchema
}
import { z } from "zod";

const createAdminValidationSchema = z.object({
    password: z.string({ required_error: "Password is Required" }),
    admin: z.object({
        name: z.string({ required_error: "Name is Required" }),
        email: z.string({ required_error: "Email is Required" }),
        contactNumber: z.string({ required_error: "Contact Number is Requied" })
    })
});

export const UserValidation = {
    createAdminValidationSchema
}
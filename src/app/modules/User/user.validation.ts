import { Gender, UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdminValidationSchema = z.object({
    password: z.string({ required_error: "Password is Required" }),
    admin: z.object({
        name: z.string({ required_error: "Name is Required" }),
        email: z.string({ required_error: "Email is Required" }),
        contactNumber: z.string({ required_error: "Contact Number is Requied" })
    })
});

const createDoctorValidationSchema = z.object({
    password: z.string({ required_error: "Password is Required" }),
    doctor: z.object({
        name: z.string({ required_error: "Name is Required" }),
        email: z.string({ required_error: "Email is Required" }),
        contactNumber: z.string({ required_error: "Contact Number is Required" }),
        address: z.string().optional(),
        profilePhoto: z.string().optional(),
        registrationNumber: z.string({ required_error: "Registration Number is Required" }),
        experience: z.number().optional().default(0),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appointmentFee: z.number({ required_error: "Appointment Fee is Required" }),
        qualification: z.string({ required_error: "Qualification is Required" }),
        currentWorkingPlace: z.string({ required_error: "Current Working Place is Required" }),
        designaton: z.string({ required_error: "Designation is Required" }),
    })
});

const createPatientValidationSchema = z.object({
    password: z.string({ required_error: "Password is required" }),
    patient: z.object({
        name: z.string({ required_error: "Name is required" }),
        email: z.string({ required_error: "Email is required" }),
        contactNumber: z.string().optional(),
        address: z.string().optional(),
        profilePhoto: z.string().optional()
    }),
});

const changeProfileStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED], { required_error: "Status is Required" })
    })
});

export const UserValidation = {
    createAdminValidationSchema,
    createDoctorValidationSchema,
    createPatientValidationSchema,
    changeProfileStatusValidationSchema
}
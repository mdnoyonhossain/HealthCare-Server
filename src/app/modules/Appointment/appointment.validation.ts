import { z } from "zod";

const createAppointmentValidatonSchema = z.object({
    body: z.object({
        doctorId: z.string({ required_error: "Doctor Id is required!" }),
        scheduleId: z.string({ required_error: "Doctor schedule id is required!" })
    })
});

export const AppointmentValidation = {
    createAppointmentValidatonSchema
};
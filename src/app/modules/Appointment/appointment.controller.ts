import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";

const createAppointment = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const appointmentData = req.body;
    const result = await AppointmentService.createAppointment(user as TAuthUser, appointmentData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Appointment booked successfully.",
        data: result
    });
});

export const AppointmentController = {
    createAppointment
}
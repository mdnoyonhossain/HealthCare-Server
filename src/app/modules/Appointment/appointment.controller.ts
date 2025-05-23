import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { AppointmentFilterableFields } from "./appointment.constant";

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

const getMyAppointment = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const filters = pick(req.query, ['status', 'paymentStatus']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await AppointmentService.getMyAppointment(user as TAuthUser, filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Appointment data retrieved successfully.",
        data: result
    });
});

const getAllAppointment = catchAsync(async (req, res) => {
    const filters = pick(req.query, AppointmentFilterableFields)
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await AppointmentService.getAllAppointment(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointment data retrieved successfully.",
        data: result
    });
});

const changeAppointmentStatus = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;
    const result = await AppointmentService.changeAppointmentStatus(id, status, user as TAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointment status changed successfully.",
        data: result
    });
});

export const AppointmentController = {
    createAppointment,
    getMyAppointment,
    getAllAppointment,
    changeAppointmentStatus
}
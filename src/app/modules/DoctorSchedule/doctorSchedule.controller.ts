import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const createDoctorSchedule = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const doctorScheduleData = req.body;
    const result = await DoctorScheduleService.createDoctorSchedule(user, doctorScheduleData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Doctor Schedule has been created successfully.",
        data: result
    });
});

const getMyDoctorScheduleFromDB = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const user = req.user;
    const result = await DoctorScheduleService.getMyDoctorScheduleFromDB(filters, options, user as TAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule data retrieved successfully.",
        data: result
    });
});

export const DoctorScheduleController = {
    createDoctorSchedule,
    getMyDoctorScheduleFromDB
}
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import pick from "../../../shared/pick";
import { TAuthUser } from "../../interfaces/common";
import { Request } from "express";

const createSchedule = catchAsync(async (req, res) => {
    const scheduleData = req.body;
    const result = await ScheduleService.createSchedule(scheduleData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Schedule has been created successfully.",
        data: result
    });
});

const getAllScheduleFromDB = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const filters = pick(req.query, ['startDate', 'endDate']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const user = req.user;
    const result = await ScheduleService.getAllScheduleFromDB(filters, options, user as TAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule data retrieved successfully.",
        data: result
    });
});

const getByIdScheduleFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ScheduleService.getByIdScheduleFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule data retrieved successfully.",
        data: result
    });
});

export const ScheduleController = {
    createSchedule,
    getAllScheduleFromDB,
    getByIdScheduleFromDB
}
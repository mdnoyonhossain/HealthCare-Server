import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";

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

export const DoctorScheduleController = {
    createDoctorSchedule
}
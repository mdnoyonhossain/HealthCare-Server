import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

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

export const ScheduleController = {
    createSchedule
}
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MetaService } from "./meta.service";
import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";

const getDashboardMetaData = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const result = await MetaService.getDashboardMetaData(user as TAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Meta data retrieved successfully.",
        data: result
    });
});

export const MetaController = {
    getDashboardMetaData
}
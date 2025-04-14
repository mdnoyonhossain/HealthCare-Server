import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";


const createAdmin = catchAsync(async (req, res) => {
    const result = await UserService.createAdmin(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Admin Created successfully.",
        data: result
    });
});

export const UserController = {
    createAdmin
}
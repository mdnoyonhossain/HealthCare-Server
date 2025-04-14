import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { UserFilterableFields } from "./user.constant";


const createAdmin = catchAsync(async (req, res) => {
    const result = await UserService.createAdmin(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Administrator account has been created successfully.",
        data: result
    });
});

const createDoctor = catchAsync(async (req, res) => {
    const result = await UserService.createDoctor(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Doctor account has been created successfully.",
        data: result
    });
});

const createPatient = catchAsync(async (req, res) => {
    const result = await UserService.createPatient(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Patient account has been created successfully.",
        data: result
    });
});

const getAllUserFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, UserFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await UserService.getAllUserFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User data retrieved successfully.",
        data: result
    });
});

export const UserController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB
}
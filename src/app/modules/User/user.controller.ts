import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { UserFilterableFields } from "./user.constant";
import { TAuthUser } from "../../interfaces/common";


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

const changeProfileStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    const result = await UserService.changeProfileStatus(id, userData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile status changed successfully.",
        data: result
    });
});

const getMyProfile = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const result = await UserService.getMyProfile(user as TAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile data fetched successfully.",
        data: result
    });
});

const updateMyProfile = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const result = await UserService.updateMyProfile(user as TAuthUser, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile has been updated successfully.",
        data: result
    });
});

export const UserController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
}
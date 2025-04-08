import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { AdminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const getAllAdminFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, AdminFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await AdminService.getAllAdminFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data retrieved successfully.",
        meta: result.meta,
        data: result.data
    });
});

const getSingleAdminFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminService.getSingleAdminFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data retrieved successfully.",
        data: result
    });
});

const updateAdminIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const adminData = req.body;
    const result = await AdminService.updateAdminIntoDB(id, adminData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data has been updated successfully.",
        data: result
    });
});

const deleteAdminFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminService.deleteAdminFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data has been deleted successfully.",
        data: result
    });
});

const softDeleteAdminFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AdminService.softDeleteAdminFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data has been deleted successfully.",
        data: result
    });
})

export const AdminController = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    updateAdminIntoDB,
    deleteAdminFromDB,
    softDeleteAdminFromDB
}
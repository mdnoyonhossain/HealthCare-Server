import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PrescriptionService } from "./prescription.service";
import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const createPrescription = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const prescriptionData = req.body;
    const result = await PrescriptionService.createPrescription(user as TAuthUser, prescriptionData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Prescription has been created successfully.",
        data: result
    });
});

const getMyPrescription = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await PrescriptionService.getMyPrescription(user as TAuthUser, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Prescription data retrieved successfully.",
        meta: result.meta,
        data: result.data
    });
});

export const PrescriptionController = {
    createPrescription,
    getMyPrescription
}
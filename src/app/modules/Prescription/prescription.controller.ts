import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PrescriptionService } from "./prescription.service";
import { Request } from "express";
import { TAuthUser } from "../../interfaces/common";

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

export const PrescriptionController = {
    createPrescription
}
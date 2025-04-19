import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { DoctorSearchableFields } from "./doctor.constant";

const getAllDoctorFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, DoctorSearchableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await DoctorService.getAllDoctorFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor data retrieved successfully.",
        meta: result.meta,
        data: result.data
    });
});

const getByIdDoctorFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DoctorService.getByIdDoctorFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor data retrieved successfully.",
        data: result
    });
});

const updateDoctorIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctorData = req.body;
    const result = await DoctorService.updateDoctorIntoDB(id, doctorData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor data has been updated successfully.",
        data: result
    });
});

const deleteDoctorFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DoctorService.deleteDoctorFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor data has been deleted successfully.",
        data: result
    });
});

const softDeleteDoctorFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await DoctorService.softDeleteDoctorFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor data has been deleted successfully.",
        data: result
    });
});

export const DoctorController = {
    getAllDoctorFromDB,
    getByIdDoctorFromDB,
    updateDoctorIntoDB,
    deleteDoctorFromDB,
    softDeleteDoctorFromDB
}
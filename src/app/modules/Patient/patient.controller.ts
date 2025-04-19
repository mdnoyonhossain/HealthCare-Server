import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { PatientFilterableFields } from "./patient.constant";
import { PatientService } from "./patient.service";

const getAllPatientFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, PatientFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await PatientService.getAllPatientFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient data retrieved successfully.",
        meta: result.meta,
        data: result.data
    });
});

const getByIdPatientFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await PatientService.getByIdPatientFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient data retrieved successfully.",
        data: result
    });
});

const updatePatientIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const patientData = req.body;
    const result = await PatientService.updatePatientIntoDB(id, patientData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient data has been updated successfully.",
        data: result
    });
});

const deletePatientFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await PatientService.deletePatientFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient data has been deleted successfully.",
        data: result
    });
});

const softDeletePatientFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await PatientService.softDeletePatientFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient data has been deleted successfully.",
        data: result
    });
})

export const PatientController = {
    getAllPatientFromDB,
    getByIdPatientFromDB,
    updatePatientIntoDB,
    deletePatientFromDB,
    softDeletePatientFromDB
}
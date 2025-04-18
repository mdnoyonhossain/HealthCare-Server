import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const specialtiesInsertIntoDB = catchAsync(async (req, res) => {
    const result = await SpecialtiesService.specialtiesInsertIntoDB(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Specialties have been successfully inserted into the database.",
        data: result
    });
});

const getAllSpecialtiesFromDB = catchAsync(async (req, res) => {
    const result = await SpecialtiesService.getAllSpecialtiesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Specialties data retrieved successfully.",
        data: result
    });
});

const getByIdSpecialityFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SpecialtiesService.getByIdSpecialityFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Specialties data retrieved successfully.",
        data: result
    });
});

const updateSpecialityIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SpecialtiesService.updateSpecialityIntoDB(id, req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Specialties data has been updated successfully.",
        data: result
    });
});

const deleteSpecialityIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SpecialtiesService.deleteSpecialityIntoDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialties data has been deleted successfully.",
        data: result
    });
});

export const SpecialtiesController = {
    specialtiesInsertIntoDB,
    getAllSpecialtiesFromDB,
    getByIdSpecialityFromDB,
    updateSpecialityIntoDB,
    deleteSpecialityIntoDB
}
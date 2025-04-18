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

export const SpecialtiesController = {
    specialtiesInsertIntoDB
}
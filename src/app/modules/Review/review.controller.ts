import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TAuthUser } from "../../interfaces/common";
import { ReviewService } from "./review.service";
import { Request } from "express";
import pick from "../../../shared/pick";
import { ReviewFilterableFields } from "./review.contant";

const createReviewIntoDB = catchAsync(async (req: Request & { user?: TAuthUser }, res) => {
    const user = req.user;
    const reviewData = req.body;
    const result = await ReviewService.createReviewIntoDB(user as TAuthUser, reviewData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review created successfully.",
        data: result
    });
});

const getAllReviewFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, ReviewFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await ReviewService.getAllReviewFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reviews retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const ReviewController = {
    createReviewIntoDB,
    getAllReviewFromDB
}
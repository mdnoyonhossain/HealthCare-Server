import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const userData = req.body;
    const result = await AuthService.loginUser(userData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully.",
        data: result
    });
});

export const AuthController = {
    loginUser
}
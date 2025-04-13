import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";
import { Request } from "express";

const loginUser = catchAsync(async (req, res) => {
    const userData = req.body;
    const result = await AuthService.loginUser(userData);

    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully.",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token generate successfully. You are now authenticated.",
        data: result
    })
});

const changePassword = catchAsync(async (req: Request & { user?: any }, res) => {
    const user = req.user;
    const changeData = req.body;
    const result = await AuthService.changePassword(user, changeData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password has been successfully changed.",
        data: result
    })
});

const forgotPassword = catchAsync(async (req, res) => {
    const userData = req.body;
    const result = await AuthService.forgotPassword(userData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password reset link has been sent to your email.",
        data: result
    })
});

export const AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword
}
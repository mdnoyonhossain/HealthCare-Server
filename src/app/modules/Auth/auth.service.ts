import { UserStatus } from "@prisma/client";
import { JwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import { TChangePassword, TForgotPassword, TLoginUser, TResetPassword } from "./auth.interface";
import bcrypt from "bcrypt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import emailSender from "./emailSender";

const loginUser = async (payload: TLoginUser) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData?.password);
    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "The current password you entered is incorrect. Please try again.");
    }

    const userPayload = {
        email: userData?.email,
        role: userData?.role
    }

    const accessToken = JwtHelpers.generateToken(userPayload, config.jwt.access_token_secrte as Secret, config.jwt.access_token_expires_in);
    const refreshToken = JwtHelpers.generateToken(userPayload, config.jwt.refresh_token_secrte as Secret, config.jwt.refresh_token_expires_in);

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData?.needPasswordChange
    };
}

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = JwtHelpers.verifyToken(token, config.jwt.refresh_token_secrte as Secret);
    }
    catch (err) {
        throw new Error("Failed to refresh token. Please login again.")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,
            status: UserStatus.ACTIVE
        }
    });

    const userPayload = {
        email: userData?.email,
        role: userData?.role
    }

    const accessToken = JwtHelpers.generateToken(userPayload, config.jwt.access_token_secrte as Secret, config.jwt.access_token_expires_in);

    return {
        accessToken,
        needPasswordChange: userData?.needPasswordChange
    }
}

const changePassword = async (user: any, payload: TChangePassword) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload?.oldPassword, userData?.password);
    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.FORBIDDEN, "The current password you entered is incorrect. Please try again.");
    }

    const hashedPassword = await bcrypt.hash(payload?.newPassword, Number(config.bcrypt_salt_round));

    await prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });

    return {
        message: "Your password has been changed successfully. For your security, please use the new password for all subsequent logins."
    };
}

const forgotPassword = async (payload: TForgotPassword) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const userPayload = {
        email: userData?.email,
        role: userData?.role
    }

    const resetPasswordToken = JwtHelpers.generateToken(userPayload, config.jwt.reset_password_secret as Secret, config.jwt.reset_password_expires_in);
    const resetLink = `${config.jwt.reset_frontend_url}?userId=${userData?.id}&token=${resetPasswordToken}`;

    await emailSender(
        userData?.email,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center;">
              <img src="https://i.ibb.co/SvLnFcL/medical-logo.png" alt="PH HealthCare Logo" style="width: 100px; margin-bottom: 20px;" />
              <h2 style="color: #2b6777;">PH HealthCare</h2>
            </div>
            <p style="font-size: 16px; color: #333;">Dear user,</p>
            <p style="font-size: 15px; color: #555;">
              We received a request to reset your password. Click the button below to proceed. If you didn't request this, you can safely ignore this email.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #2b6777; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 14px; color: #777;">
              This link will expire in 15 minutes for your security. If you need further assistance, feel free to contact our support team.
            </p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center;">
              &copy; ${new Date().getFullYear()} PH HealthCare. All rights reserved.
            </p>
          </div>
        `
    );

    return userData.email;
}

const resetPassword = async (token: string, payload: TResetPassword) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = JwtHelpers.verifyToken(token, config.jwt.reset_password_secret as Secret);
    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Invalid or expired token. Please try again.");
    }

    const hashedPassword = await bcrypt.hash(payload?.password, Number(config.bcrypt_salt_round));

    await prisma.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });

    return {
        message: "Your password has been successfully updated. You can now log in with your new password."
    };
}

export const AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}
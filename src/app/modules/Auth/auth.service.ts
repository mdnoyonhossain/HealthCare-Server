import { UserStatus } from "@prisma/client";
import { JwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import { TChangePassword, TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

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

export const AuthService = {
    loginUser,
    refreshToken,
    changePassword
}
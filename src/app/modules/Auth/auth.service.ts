import prisma from "../../../shared/prisma";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData?.password);
    if (!isCorrectPassword) {
        throw new Error("Password Incorrent!");
    }

    const userPayload = {
        email: userData?.email,
        role: userData?.role
    }

    const accessToken = jwt.sign(userPayload, 'fdafda', { algorithm: 'HS256', expiresIn: '5m' });
    const refreshToken = jwt.sign(userPayload, 'ffff', { algorithm: 'HS256', expiresIn: '5d' });

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData?.needPasswordChange
    };
}

export const AuthService = {
    loginUser
}
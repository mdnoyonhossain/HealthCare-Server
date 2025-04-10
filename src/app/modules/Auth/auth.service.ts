import { JwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";

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

    const accessToken = JwtHelpers.generateToken(userPayload, 'fdasfas', '5m');
    const refreshToken = JwtHelpers.generateToken(userPayload, 'ffffff', '10d');

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData?.needPasswordChange
    };
}

export const AuthService = {
    loginUser
}
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

    const userPayload = {
        email: userData?.email,
        role: userData?.role
    }

    const accessToken = jwt.sign(userPayload, 'fdafda', { algorithm: 'HS256', expiresIn: '15m' });
console.log(accessToken);
    return userData;
}

export const AuthService = {
    loginUser
}
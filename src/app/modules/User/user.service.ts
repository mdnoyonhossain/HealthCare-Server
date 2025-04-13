import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import config from "../../../config";

const createAdmin = async (payload: any) => {
    const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_round));

    const userData = {
        email: payload.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: payload.admin
        });

        return createdAdminData;
    });

    return result;
}

export const UserService = {
    createAdmin
}
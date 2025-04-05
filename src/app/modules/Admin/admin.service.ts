import { Prisma, PrismaClient } from "@prisma/client"
import { AdminSearchAbleFields } from "./admin.constant";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (params: any) => {
    const andCondions: Prisma.AdminWhereInput[] = [];

    if (params?.searchTerm) {
        andCondions.push({
            OR: AdminSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    const whereCondions: Prisma.AdminWhereInput = { AND: andCondions };

    const result = await prisma.admin.findMany({
        where: whereCondions
    });

    return result;
}

export const AdminService = {
    getAllAdminFromDB
}
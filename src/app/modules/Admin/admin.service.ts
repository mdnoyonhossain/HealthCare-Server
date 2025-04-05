import { Prisma, PrismaClient } from "@prisma/client"
import { AdminSearchAbleFields } from "./admin.constant";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (params: any) => {
    const andCondions: Prisma.AdminWhereInput[] = [];
    const { searchTerm, ...filterData } = params;

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

    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
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
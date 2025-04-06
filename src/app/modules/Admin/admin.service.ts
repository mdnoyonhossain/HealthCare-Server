import { Prisma, PrismaClient } from "@prisma/client"
import { AdminSearchableFields } from "./admin.constant";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (params: any, options: any) => {
    const { page, limit } = options;
    const andCondions: Prisma.AdminWhereInput[] = [];
    const { searchTerm, ...filterData } = params;

    if (params?.searchTerm) {
        andCondions.push({
            OR: AdminSearchableFields.map(field => ({
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
        where: whereCondions,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
    });

    return result;
}

export const AdminService = {
    getAllAdminFromDB
}
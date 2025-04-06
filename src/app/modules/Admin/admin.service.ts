import { Prisma, PrismaClient } from "@prisma/client"
import { AdminSearchableFields } from "./admin.constant";

const prisma = new PrismaClient();
type TPageResult = {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: string
}
const calculatePagination = (options: TPageResult) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (Number(page) - 1) * Number(limit);
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

const getAllAdminFromDB = async (params: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
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
        skip,
        take: Number(limit),
        orderBy: sortBy && sortOrder ? {
            [sortBy]: sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    return result;
}

export const AdminService = {
    getAllAdminFromDB
}
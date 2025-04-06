import { Prisma } from "@prisma/client"
import { AdminSearchableFields } from "./admin.constant";
import { PaginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";

const getAllAdminFromDB = async (params: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = PaginationHelper.calculatePagination(options);
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

    const total = await prisma.admin.count({
        where: whereCondions
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}

export const AdminService = {
    getAllAdminFromDB
}
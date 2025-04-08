import { Admin, Prisma, UserStatus } from "@prisma/client"
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

    andCondions.push({
        isDeleted: false
    });

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

const getSingleAdminFromDB = async (id: string): Promise<Admin | null> => {
    const result = await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    return result;
}

const updateAdminIntoDB = async (id: string, payload: Partial<Admin>): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.admin.update({
        where: {
            id
        },
        data: payload
    });

    return result;
}

const deleteAdminFromDB = async (id: string): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.delete({
            where: {
                id
            }
        });

        await transactionClient.user.delete({
            where: {
                email: adminDeletedData?.email
            }
        });

        return adminDeletedData;
    });

    return result;
}

const softDeleteAdminFromDB = async (id: string): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });

    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });

        await transactionClient.user.update({
            where: {
                email: adminDeletedData?.email
            },
            data: {
                status: UserStatus.DELETED
            }
        });

        return adminDeletedData;
    });

    return result;
}

export const AdminService = {
    getAllAdminFromDB,
    getSingleAdminFromDB,
    updateAdminIntoDB,
    deleteAdminFromDB,
    softDeleteAdminFromDB
}
import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { PaginationHelper } from "../../../helpers/paginationHelper";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TDoctorFilterRequest } from "./doctor.interface";
import { DoctorSearchableFields } from "./doctor.constant";
import prisma from "../../../shared/prisma";

const getAllDoctorFromDB = async (params: TDoctorFilterRequest, options: TPaginationOptions) => {
    const { limit, page, skip } = PaginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = params;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: DoctorSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    };

    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        })
    };

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        },
    });

    const total = await prisma.doctor.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
}

const getByIdDoctorFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });

    return result;
}

const updateDoctorIntoDB = async (id: string, payload: any) => {
    const { specialties, ...doctorData } = payload;

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: { id }
    });

    await prisma.$transaction(async (transactionClient) => {
        await transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorData
        });

        if (specialties && specialties.length > 0) {
            // delete specialties
            const deleteSpecialtiesIds = specialties.filter((specialty: any) => specialty.isDeleted)
            for (const specialty of deleteSpecialtiesIds) {
                await transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialitiesId
                    }
                })
            }

            // create specialties
            const createSpecialtiesIds = specialties.filter((specialty: any) => !specialty.isDeleted);
            for (const specialty of createSpecialtiesIds) {
                await transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialitiesId: specialty.specialitiesId
                    }
                })
            }
        }
    });

    const result = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });

    return result;
}

const deleteDoctorFromDB = async (id: string): Promise<Doctor | null> => {
    await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.delete({
            where: {
                id
            }
        });

        await transactionClient.user.delete({
            where: {
                email: deleteDoctor?.email
            }
        });

        return deleteDoctor;
    });

    return result;
}

const softDeleteDoctorFromDB = async (id: string): Promise<Doctor | null> => {
    await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
        }
    });

    return await prisma.$transaction(async transactionClient => {
        const deleteDoctor = await transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deleteDoctor;
    });
}

export const DoctorService = {
    getAllDoctorFromDB,
    getByIdDoctorFromDB,
    updateDoctorIntoDB,
    deleteDoctorFromDB,
    softDeleteDoctorFromDB
}
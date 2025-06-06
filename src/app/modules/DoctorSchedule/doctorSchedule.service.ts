import { Prisma } from "@prisma/client";
import { PaginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma"
import { TAuthUser } from "../../interfaces/common";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TDoctorScheduleFilterRequest, TDoctorScheduleIds } from "./doctorSchedule.interface";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const createDoctorSchedule = async (user: any, payload: TDoctorScheduleIds) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId,
        isBooked: false
    }));

    const result = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    });

    return result;
}

const getMyDoctorScheduleFromDB = async (filters: any, options: TPaginationOptions, user: TAuthUser) => {
    const { limit, page, skip } = PaginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions = [];

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    schedule: {
                        startDateTime: {
                            gte: startDate
                        }
                    }
                },
                {
                    schedule: {
                        endDateTime: {
                            lte: endDate
                        }
                    }
                }
            ]
        });
    }

    if (Object.keys(filterData).length > 0) {
        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true
        }
        else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false
        }

        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.DoctorSchedulesWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctorSchedules.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {}
    });

    const total = await prisma.doctorSchedules.count({
        where: whereConditions
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

const deleteDoctorScheduleFromDB = async (user: TAuthUser, scheduleId: string) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const isBookedDoctorSchedule = await prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: scheduleId,
            isBooked: true
        }
    });

    if (isBookedDoctorSchedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You can not deeted the schedule because of the schedule is already booked.")
    }

    const result = await prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleId
            }
        }
    });

    return result;
}

const getAllDoctorScheduleFromDB = async (filters: TDoctorScheduleFilterRequest, options: TPaginationOptions) => {
    const { limit, page, skip } = PaginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            doctor: {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'true') {
            filterData.isBooked = true;
        } else if (typeof filterData.isBooked === 'string' && filterData.isBooked === 'false') {
            filterData.isBooked = false;
        }

        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        });
    }

    const whereConditions: any = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctorSchedules.findMany({
        include: {
            doctor: true,
            schedule: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {},
    });

    const total = await prisma.doctorSchedules.count({
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
};

export const DoctorScheduleService = {
    createDoctorSchedule,
    getMyDoctorScheduleFromDB,
    deleteDoctorScheduleFromDB,
    getAllDoctorScheduleFromDB
}
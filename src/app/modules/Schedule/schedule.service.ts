import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { TFilterRequest, TSchedule } from "./schedule.interface";
import { PaginationHelper } from "../../../helpers/paginationHelper";
import { TPaginationOptions } from "../../interfaces/pagination";
import { Prisma, Schedule } from "@prisma/client";
import { TAuthUser } from "../../interfaces/common";

const createSchedule = async (payload: TSchedule) => {
    const { startDate, endDate, startTime, endTime } = payload;
    const interverlTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            )
        );

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
            )
        );

        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: addMinutes(startDateTime, interverlTime)
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });

                schedules.push(result);
            }

            startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules;
}

const getAllScheduleFromDB = async (filters: TFilterRequest, options: TPaginationOptions, user: TAuthUser) => {
    const { limit, page, skip } = PaginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions = [];

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate
                    }
                },
                {
                    endDateTime: {
                        lte: endDate
                    }
                }
            ]
        });
    }

    if (Object.keys(filterData).length > 0) {
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

    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user?.email
            }
        }
    });

    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: { notIn: doctorScheduleIds }
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: { notIn: doctorScheduleIds }
        }
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

const getByIdScheduleFromDB = async (id: string): Promise<Schedule | null> => {
    const result = await prisma.schedule.findUniqueOrThrow({
        where: {
            id
        }
    });

    return result;
};

const deleteScheduleFromDB = async (id: string): Promise<Schedule> => {
    const result = await prisma.schedule.delete({
        where: {
            id
        }
    });

    return result;
};

export const ScheduleService = {
    createSchedule,
    getAllScheduleFromDB,
    getByIdScheduleFromDB,
    deleteScheduleFromDB
}
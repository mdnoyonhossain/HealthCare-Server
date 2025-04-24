import { Prisma, UserRole } from "@prisma/client";
import { PaginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TAppointment } from "./appointment.interface";
import { v4 as uuidv4 } from 'uuid';

const createAppointment = async (user: TAuthUser, payload: TAppointment) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email,
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId
        }
    });

    await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    });

    const videoCallingId = uuidv4();

    const result = await prisma.$transaction(async (transactionClient) => {
        const appointmentData = await transactionClient.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId: videoCallingId
            },
            include: {
                patient: true,
                doctor: true,
                schedule: true
            }
        });

        await transactionClient.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appointmentData.id
            }
        });

        const today = new Date();
        const transactionId = `PH-HealthCare-${today.getFullYear()}${today.getMonth()}${today.getDay()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;

        await transactionClient.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        });

        return appointmentData;
    });

    return result;
}

const getMyAppointment = async (user: TAuthUser, filters: any, options: TPaginationOptions) => {
    const { limit, page, skip } = PaginationHelper.calculatePagination(options);
    const { ...filterData } = filters;

    const andConditions: Prisma.AppointmentWhereInput[] = [];

    if (user?.role === UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user?.email
            }
        });
    }
    else if (user?.role === UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user?.email
            }
        });
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.AppointmentWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: user?.role === UserRole.PATIENT
            ? { doctor: true, schedule: true } : { patient: { include: { medicalReport: true, patientHealthData: true } }, schedule: true }
    });

    const total = await prisma.appointment.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    }
}

export const AppointmentService = {
    createAppointment,
    getMyAppointment
}
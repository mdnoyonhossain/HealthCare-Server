import { AppointmentStatus, PaymentStatus, Prescription, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces/pagination";
import { PaginationHelper } from "../../../helpers/paginationHelper";
import { TPrescriptionFilterRequest } from "./prescription.interface";

const createPrescription = async (user: TAuthUser, payload: Partial<Prescription>) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            // status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    });

    if (!(user?.email === appointmentData.doctor.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized to create a prescription for this appointment.");
    }

    const result = await prisma.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || null || undefined
        },
        include: {
            patient: true
        }
    });

    return result;
}

const getMyPrescription = async (user: TAuthUser, options: TPaginationOptions) => {
    const { limit, page, skip } = PaginationHelper.calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user?.email
            }
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctor: true,
            patient: true,
            appointment: {
                include: {
                    schedule: true,
                    payment: true
                }
            },

        }
    });

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user?.email
            }
        },
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

const getAllPrescription = async (filters: TPrescriptionFilterRequest, options: TPaginationOptions) => {
    const { limit, page, skip } = PaginationHelper.calculatePagination(options);
    const { patientEmail, doctorEmail } = filters;

    const andConditions = [];

    if (patientEmail) {
        andConditions.push({
            patient: {
                email: patientEmail
            }
        })
    }

    if (doctorEmail) {
        andConditions.push({
            doctor: {
                email: doctorEmail
            }
        })
    }

    const whereConditions: Prisma.PrescriptionWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.prescription.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
        include: {
            doctor: true,
            patient: true,
            appointment: true,
        },
    });

    const total = await prisma.prescription.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result
    }
}

export const PrescriptionService = {
    createPrescription,
    getMyPrescription,
    getAllPrescription
}
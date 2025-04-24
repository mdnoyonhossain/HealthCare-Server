import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";
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
        const transactionId = `PH-HealthCare-${today.getFullYear()}${today.getMonth()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;

        await transactionClient.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId: transactionId
            }
        });

        return appointmentData;
    });

    return result;
}

export const AppointmentService = {
    createAppointment
}
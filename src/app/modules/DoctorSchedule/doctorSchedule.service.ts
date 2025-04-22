import prisma from "../../../shared/prisma"
import { TDoctorScheduleIds } from "./doctorSchedule.interface";

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

export const DoctorScheduleService = {
    createDoctorSchedule
}
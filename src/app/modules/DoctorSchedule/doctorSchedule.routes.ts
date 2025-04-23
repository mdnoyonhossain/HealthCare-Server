import express from "express";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMyDoctorScheduleFromDB
);

router.post(
    '/',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.createDoctorSchedule
);

router.delete(
    '/:id',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.deleteDoctorScheduleFromDB
);

export const DoctorScheduleRoutes = router;
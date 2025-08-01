import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorController } from "./doctor.controller";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorValidation } from "./doctor.validation";

const router = express.Router();

router.get('/', DoctorController.getAllDoctorFromDB);

router.get('/:id', DoctorController.getByIdDoctorFromDB);

router.patch(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
    validateRequest(DoctorValidation.updateDoctorValidationSchema),
    DoctorController.updateDoctorIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.deleteDoctorFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.softDeleteDoctorFromDB
);

export const DoctorRoutes = router;
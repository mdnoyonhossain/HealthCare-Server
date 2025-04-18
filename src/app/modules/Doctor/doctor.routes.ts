import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorController } from "./doctor.controller";

const router = express.Router();

router.get('/', DoctorController.getAllDoctorFromDB);

router.get('/:id', DoctorController.getByIdDoctorFromDB);

// router.patch(
//     '/:id',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//     validateRequest(DoctorValidation.createDoctorValidationSchema),
//     DoctorController.updateDoctorIntoDB
// );

router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.deleteDoctorFromDB
);

router.patch(
    '/soft/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.softDeleteDoctorFromDB
);

export const DoctorRoutes = router;
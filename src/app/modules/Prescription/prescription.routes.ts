import express from "express";
import { PrescriptionController } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { PrescriptionValidation } from "./prescription.validation";

const router = express.Router();

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    PrescriptionController.getAllPrescription
);

router.get(
    '/my-prescription',
    auth(UserRole.PATIENT),
    PrescriptionController.getMyPrescription
);

router.post(
    '/',
    auth(UserRole.DOCTOR),
    validateRequest(PrescriptionValidation.createPrescriptionValidationSchema),
    PrescriptionController.createPrescription
);

export const PrescriptionRoutes = router;
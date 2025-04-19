import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getAllAdminFromDB
);

router.get(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getSingleAdminFromDB
);

router.patch(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(AdminValidation.updateAdminValidationSchema),
    AdminController.updateAdminIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.deleteAdminFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.softDeleteAdminFromDB
);

export const AdminRoutes = router;
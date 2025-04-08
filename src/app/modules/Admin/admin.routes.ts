import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";
import { AnyZodObject } from "zod";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get('/', AdminController.getAllAdminFromDB);

router.get('/:id', AdminController.getSingleAdminFromDB);

router.patch(
    '/:id',
    validateRequest(AdminValidation.updateAdminValidationSchema),
    AdminController.updateAdminIntoDB
);

router.delete('/:id', AdminController.deleteAdminFromDB);

router.patch('/soft/:id', AdminController.softDeleteAdminFromDB);

export const AdminRoutes = router;
import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";

const router = express.Router();

router.post(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    UserController.createAdmin
);

export const UserRoutes = router;
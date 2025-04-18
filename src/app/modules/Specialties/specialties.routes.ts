import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesController } from "./specialties.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialtiesValidation } from "./specialties.validation";

const router = express.Router();

router.get('/', SpecialtiesController.getAllSpecialtiesFromDB);

router.get('/:id', SpecialtiesController.getByIdSpecialityFromDB);

router.post(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidation.createSpecialtiesValidationSchema.parse(JSON.parse(req.body.data));
        return SpecialtiesController.specialtiesInsertIntoDB(req, res, next);
    }
);

router.patch(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidation.updateSpecialtiesValidationSchema.parse(JSON.parse(req.body.data));
        return SpecialtiesController.updateSpecialityIntoDB(req, res, next);
    }
);

router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    SpecialtiesController.deleteSpecialityIntoDB
);

export const SpecialtiesRoutes = router;
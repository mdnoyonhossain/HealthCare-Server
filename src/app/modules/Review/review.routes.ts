import express from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";

const router = express.Router();

router.get('/', ReviewController.getAllReviewFromDB);

router.post(
    '/',
    auth(UserRole.PATIENT),
    validateRequest(ReviewValidation.createReviewValidationSchema),
    ReviewController.createReviewIntoDB
);

export const ReviewRoutes = router;
import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get('/', AdminController.getAllAdminFromDB);

router.get('/:id', AdminController.getSingleAdminFromDB);

router.patch('/:id', AdminController.updateAdminIntoDB);

export const AdminRoutes = router;
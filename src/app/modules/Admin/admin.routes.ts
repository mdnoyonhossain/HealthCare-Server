import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get('/', AdminController.getAllAdminFromDB);

router.get('/:id', AdminController.getSingleAdminFromDB);

router.patch('/:id', AdminController.updateAdminIntoDB);

router.delete('/:id', AdminController.deleteAdminFromDB);

router.patch('/soft/:id', AdminController.softDeleteAdminFromDB);

export const AdminRoutes = router;
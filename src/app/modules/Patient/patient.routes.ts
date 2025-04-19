import express from "express";
import { PatientController } from "./patient.controller";

const router = express.Router();

router.get('/', PatientController.getAllPatientFromDB);

router.get('/:id', PatientController.getByIdPatientFromDB);

router.patch('/:id', PatientController.updatePatientIntoDB);

router.delete('/:id', PatientController.deletePatientFromDB);

router.delete('/soft/:id', PatientController.softDeletePatientFromDB);

export const PatientRoutes = router;
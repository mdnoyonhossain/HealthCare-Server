import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { AppointmentService } from "./app/modules/Appointment/appointment.service";
import cron from "node-cron";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({ message: "PH-HealthCare Server.." });
});

cron.schedule('* * * * *', () => {
    try {
        AppointmentService.cancelUnpaidAppointments();
    }
    catch (err) {
        console.error('Error while cancelling unpaid appointments:', err);
    }
});

app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
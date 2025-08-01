import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { AppointmentService } from "./app/modules/Appointment/appointment.service";
import cron from "node-cron";

const app: Application = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>HealthCare API Server</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  text-align: center;
                  padding: 50px;
              }
              h1 {
                  color: #2c3e50;
              }
              p {
                  color: #34495e;
              }
          </style>
      </head>
      <body>
          <h1>Welcome to the HealthCare Server</h1>
          <p>Status: <strong>Running</strong></p>
          <p>Server Time: ${new Date().toLocaleString()}</p>
          <p>Version: 1.0.0</p>
      </body>
      </html>
    `);
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
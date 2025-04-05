import express, { Application, Request, Response } from "express";
import cors from "cors";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";
import { UserRoutes } from "./app/modules/User/user.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({ message: "PH-HealthCare Server.." });
});

app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/admin', AdminRoutes);

export default app;
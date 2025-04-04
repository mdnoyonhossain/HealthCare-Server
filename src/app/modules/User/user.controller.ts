import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
    const adminData = req.body;
    const result = await userService.createAdmin(adminData);
    res.send(result);
}

export const userController = {
    createAdmin
}
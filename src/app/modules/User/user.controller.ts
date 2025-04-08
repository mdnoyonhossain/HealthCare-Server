import { Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";


const createAdmin = async (req: Request, res: Response) => {
    try {
        const adminData = req.body;
        const result = await UserService.createAdmin(adminData);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Admin Created successfully.",
            data: result
        });
    }
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.name || "Something went wrong!",
            error: err
        })
    }
}

export const UserController = {
    createAdmin
}
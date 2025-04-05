import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllAdminFromDB = async (req: Request, res: Response) => {
    try {
        const query = req.query;
        const result = await AdminService.getAllAdminFromDB(query);

        res.status(200).json({
            success: true,
            message: "Admin Data Retrived Successfull!",
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

export const AdminController = {
    getAllAdminFromDB
}
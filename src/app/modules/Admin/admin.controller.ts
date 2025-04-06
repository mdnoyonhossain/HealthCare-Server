import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";

const getAllAdminFromDB = async (req: Request, res: Response) => {
    try {
        const filters = pick(req.query, ['name', 'email', 'searchTerm', 'contactNumber']);
        const result = await AdminService.getAllAdminFromDB(filters);

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
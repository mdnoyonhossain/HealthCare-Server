import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { AdminFilterableFields } from "./admin.constant";

const getAllAdminFromDB = async (req: Request, res: Response) => {
    try {
        const filters = pick(req.query, AdminFilterableFields);
        const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
        const result = await AdminService.getAllAdminFromDB(filters, options);

        res.status(200).json({
            success: true,
            message: "Admin Data Retrived Successfull!",
            meta: result.meta,
            data: result.data
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

const getSingleAdminFromDB = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await AdminService.getSingleAdminFromDB(id);

        res.status(200).json({
            success: true,
            message: "Admin Data Retrived By ID!",
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
    getAllAdminFromDB,
    getSingleAdminFromDB
}
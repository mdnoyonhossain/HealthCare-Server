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
            message: "Admin data retrieved successfully.",
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
            message: "Admin data retrieved successfully.",
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

const updateAdminIntoDB = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const adminData = req.body;
        const result = await AdminService.updateAdminIntoDB(id, adminData);

        res.status(200).json({
            success: true,
            message: "Admin data has been updated successfully.",
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

const deleteAdminFromDB = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await AdminService.deleteAdminFromDB(id);

        res.status(200).json({
            success: true,
            message: "Admin data has been deleted successfully.",
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

const softDeleteAdminFromDB = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await AdminService.softDeleteAdminFromDB(id);

        res.status(200).json({
            success: true,
            message: "Admin data has been deleted successfully.",
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
    getSingleAdminFromDB,
    updateAdminIntoDB,
    deleteAdminFromDB,
    softDeleteAdminFromDB
}
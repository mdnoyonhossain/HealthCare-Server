import { Response } from "express";

type TApiResponse<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
    }
    data: T | null | undefined;
}

const sendResponse = <T>(res: Response, payload: TApiResponse<T>) => {
    res.status(payload.statusCode).json({
        success: payload.success,
        message: payload.message,
        meta: payload.meta || null || undefined,
        data: payload.data || null || undefined
    });
};

export default sendResponse;
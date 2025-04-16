import { NextFunction, Request, Response } from "express";
import { JwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";
import { TAuthUser } from "../interfaces/common";

const auth = (...roles: string[]) => {
    return async (req: Request & { user?: TAuthUser }, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "Access denied. Invalid or missing authorization token.");
            }

            const verifiedUser = JwtHelpers.verifyToken(token, config.jwt.access_token_secrte as Secret);
            req.user = verifiedUser as TAuthUser;

            if (roles.length && !roles.includes(verifiedUser?.role)) {
                throw new ApiError(httpStatus.FORBIDDEN, `Access denied. Your role '${verifiedUser.role}' does not have permission to perform this action.`);
            }

            next();
        }
        catch (err) {
            next(err);
        }
    }
}

export default auth;
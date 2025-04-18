import { Request } from "express";
import { TFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const specialtiesInsertIntoDB = async (req: Request) => {
    const file = req.file as TFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    }

    const result = await prisma.specialties.create({
        data: req.body
    });

    return result;
}

const getAllSpecialtiesFromDB = async () => {
    const result = await prisma.specialties.findMany();

    return result;
}

const getByIdSpecialityFromDB = async (id: string) => {
    const result = await prisma.specialties.findUniqueOrThrow({
        where: {
            id
        }
    });

    return result;
}

export const SpecialtiesService = {
    specialtiesInsertIntoDB,
    getAllSpecialtiesFromDB,
    getByIdSpecialityFromDB
}
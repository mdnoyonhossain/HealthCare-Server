import { Request } from "express";
import { TFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { Specialties } from "@prisma/client";

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

const updateSpecialityIntoDB = async (id: string, req: Request) => {
    const file = req.file as TFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    }

    const result = await prisma.specialties.update({
        where: {
            id
        },
        data: req.body
    });

    return result;
}

const deleteSpecialityIntoDB = async (id: string) => {
    const result = await prisma.specialties.delete({
        where: {
            id
        }
    });

    return result;
}

export const SpecialtiesService = {
    specialtiesInsertIntoDB,
    getAllSpecialtiesFromDB,
    getByIdSpecialityFromDB,
    updateSpecialityIntoDB,
    deleteSpecialityIntoDB
}
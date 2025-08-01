import { UserRole } from "@prisma/client";
import prisma from "../src/shared/prisma";
import bcrypt from "bcrypt";
import config from "../src/config";

const seedSuperAdmin = async () => {
    try {
        const isExistSuperAdmin = await prisma.user.findFirst({
            where: {
                role: UserRole.SUPER_ADMIN
            }
        });

        if (isExistSuperAdmin) {
            console.log("Super Admin already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash("superadmin", Number(config.bcrypt_salt_round));

        const superAdminData = await prisma.user.create({
            data: {
                email: "noyon@superadmin.com",
                password: hashedPassword,
                role: UserRole.SUPER_ADMIN,
                admin: {
                    create: {
                        name: "Noyon Hossain",
                        contactNumber: "0170000000"
                    }
                }
            }
        });

        console.log("Super Admin seeded successfully!", superAdminData);
    }
    catch (err: any) {
        throw new Error(`Seeding Super Admin failed. ${err.message}`);
    }
    finally {
        await prisma.$disconnect();
    }
}

seedSuperAdmin();
import prisma from "../../../shared/prisma";
import { SSLService } from "../SSL/ssl.service";
import { PaymentStatus } from "@prisma/client";

const initPayment = async (appointmentId: string) => {
    const paymentData = await prisma.payment.findFirstOrThrow({
        where: {
            appointmentId
        },
        include: {
            appointment: {
                include: {
                    patient: true
                }
            }
        }
    });

    const initPaymentData = {
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        name: paymentData.appointment.patient.name,
        email: paymentData.appointment.patient.email,
        address: paymentData.appointment.patient.address,
        contactNumber: paymentData.appointment.patient.contactNumber,
    }

    const result = await SSLService.initPayment(initPaymentData);

    return {
        paymentUrl: result.GatewayPageURL
    }
}

const validatePayment = async (payload: any) => {
    // live
    // if (!payload || !payload.status || !(payload.status === 'VALID')) {
    //     return {
    //         message: "Invalid Payment!"
    //     }
    // }

    // const response = await SSLService.validatePayment(payload);

    // if (response?.status !== 'VALID') {
    //     return {
    //         message: "Payment Faild!"
    //     }
    // }

    // local
    const response = payload;

    await prisma.$transaction(async (transactionClient) => {
        const updatedPaymentData = await transactionClient.payment.update({
            where: {
                transactionId: response?.tran_id
            },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: response
            }
        });

        await transactionClient.appointment.update({
            where: {
                id: updatedPaymentData.appointmentId
            },
            data: {
                paymentStatus: PaymentStatus.PAID
            }
        })
    });

    return {
        message: "Payment successfully."
    }
}

export const PaymentService = {
    initPayment,
    validatePayment
}
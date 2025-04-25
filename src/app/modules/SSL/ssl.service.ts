import axios from "axios";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const initPayment = async (paymentData: any) => {
    try {
        const data = {
            store_id: config.ssl.ssl_store_id,
            store_passwd: config.ssl.ssl_store_password,
            total_amount: paymentData.amount,
            currency: 'BDT',
            tran_id: paymentData.transactionId,
            success_url: `${config.ssl.ssl_base_url}/success`,
            fail_url: `${config.ssl.ssl_base_url}/fail`,
            cancel_url: `${config.ssl.ssl_base_url}/cancel`,
            ipn_url: `${config.ssl.ssl_base_url}/ipn`,
            product_name: 'Appointment',
            cus_name: paymentData.name,
            cus_email: paymentData.email,
            cus_add1: paymentData.address,
            cus_country: 'Bangladesh',
            cus_phone: paymentData.contactNumber
        }

        const response = await axios({
            method: "post",
            url: config.ssl.ssl_payment_api,
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return response.data;
    }
    catch (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Payment error occured!");
    }
}

export const SSLService = {
    initPayment
}
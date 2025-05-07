import nodemailer from 'nodemailer';
import config from '../../../config';

export const emailSender = async (email: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config.emailSender.sender_email,
            pass: config.emailSender.app_password_email,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await transporter.sendMail({
        from: `"HealthCare Support" <${config.emailSender.sender_email}>`,
        to: email,
        subject: "Reset Your Password - HealthCare",
        html
    });
};

export default emailSender;
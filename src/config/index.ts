import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
    jwt: {
        access_token_secrte: process.env.ACCESS_TOKEN_SECRET,
        access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
        refresh_token_secrte: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_password_secret: process.env.RESET_PASSWORD_SECRET,
        reset_password_expires_in: process.env.RESET_PASSWORD_EXPIRES_IN,
        reset_frontend_url: process.env.RESET_FRONTEND_URL,
    },
    emailSender: {
        sender_email: process.env.SENDER_EMAIL,
        app_password_email: process.env.APP_PASSWORD_EMAIL
    },
    ssl: {
        ssl_store_id: process.env.SSL_STORE_ID,
        ssl_store_password: process.env.SSL_STORE_PASSWORD,
        ssl_base_url: process.env.SSL_BASE_URL,
        ssl_payment_api: process.env.SSL_PAYMENT_API,
        ssl_validaton_api: process.env.SSL_VALIDATION_API,
    }
}
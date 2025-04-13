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
    }
}
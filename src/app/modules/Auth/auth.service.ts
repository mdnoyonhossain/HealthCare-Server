import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
    console.log('login user..', payload);
}

export const AuthService = {
    loginUser
}
import jwt, { SignOptions } from 'jsonwebtoken';

const generateToken = (payload: any, secret: string, expiresIn: any) => {
    const options: SignOptions = {
        algorithm: 'HS256',
        expiresIn
    };

    const token = jwt.sign(payload, secret, options);

    return token;
}

export const JwtHelpers = {
    generateToken
};
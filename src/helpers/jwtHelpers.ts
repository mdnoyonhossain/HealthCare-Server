import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

const generateToken = (payload: any, secret: Secret, expiresIn: any) => {
    const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn });
    return token;
}

const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload;
}

export const JwtHelpers = {
    generateToken,
    verifyToken
};
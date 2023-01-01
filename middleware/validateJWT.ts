import { Request, Response, NextFunction } from 'express';
import config from '../config';
const jwt = require('jsonwebtoken');
import { error } from "../utils/api.response";


export const validateJWT = (req: Request, res: Response, next: NextFunction) => {

    const token = req.header('bbva-token');

    if (!token) {
        return error(res, {
            bodyData: {
                messages: [`[Auth] Token not found.`],
            },
            httpCode: 401
        });
    }

    try {
        const jwtSecretKey = config.JWT_SECRET_TOKEN;

        const { name, phone_number } = jwt.verify(token, jwtSecretKey);

        req.u_phone_number = phone_number;

        next();

    } catch (err) {

        error(res, {
            bodyData: {
                messages: [`[Auth] Token not valid.`],
            },
            httpCode: 401
        });

    }

}

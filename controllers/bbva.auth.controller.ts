import { Request, Response } from 'express';
import config from "../config";
import { twoFAFailedMsg } from '../constants/responses.messages';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { success, error } from "../utils/api.response";
import { makeRandString, sendSMS } from '../services/aws.sns';

export const generate2FACode = async (req: Request, res: Response) => {
    const { phone_number } = req.body;

    const user = await User.findOne({ where: { phone_number } });

    if (!user)
        return error(res, {
            bodyData: {
                messages: [`User not found.`],
            },
            httpCode: 401
        });


    const code = makeRandString(5);
    let message = `${user.name}, tu codigo de verificación es : ${code}`;

    await user.update({ sms_verification_code: code });
    await sendSMS(user.phone_number, message);
    req.app.get('socket').emit(`server-send-2FA-code`, { message, code });

    success(res, {});
}

export const validate2FA = async (req: Request, res: Response) => {

    const { verification_code, phone_number } = req.body;

    const user = await User.findOne({ where: { phone_number } });

    if (!user)
        return error(res, {
            bodyData: {
                messages: [`User not found.`],
            },
            httpCode: 401
        });

    if (verification_code !== user!.sms_verification_code) {
        return error(res, {
            bodyData: {
                messages: [twoFAFailedMsg],
            },
            httpCode: 401
        });
    }

    success(res, {});
}

export const getRefreshToken = async (req: Request, res: Response) => {

    const { phone_number } = req.body;

    const jwtSecretKey = config.JWT_SECRET_REFRESH_TOKEN;

    const data = { phone_number };

    const refreshToken = jwt.sign(data, jwtSecretKey, { expiresIn: '1h' });

    success(res, {
        bodyData: {
            refreshToken,
        }
    });
}


export const getToken = async (req: Request, res: Response) => {

    const { refreshToken } = req.body;

    const jwtResfreshSecretKey = config.JWT_SECRET_REFRESH_TOKEN;

    try {

        const { phone_number } = jwt.verify(refreshToken, jwtResfreshSecretKey);

        const jwtSecretKey = config.JWT_SECRET_TOKEN;

        const data = { phone_number };

        const token = jwt.sign(data, jwtSecretKey, { expiresIn: '1h' });

        success(res, {
            bodyData: {
                token,
            }
        });

    } catch (err) {
        error(res, {
            bodyData: {
                messages: [`[Auth] RefreshToken not valid.`],
            },
            httpCode: 401
        });
    }


}
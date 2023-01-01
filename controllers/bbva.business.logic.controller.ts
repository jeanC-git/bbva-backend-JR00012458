import { Request, Response } from 'express';
import axios from 'axios';
import { success, error } from "../utils/api.response";
import { sendSMS } from '../services/aws.sns';
import { bbvaServiceUpdateBalanceFailedMsg, externalServiceResFailedMsg, externalServiceResSuccessMsg, transactionDataInvalidMsg, transactionSuccessMsg } from '../constants/responses.messages';
import User from '../models/user';

export const validateTransaction = async (req: Request, res: Response) => {

    const { u_phone_number } = req;

    const { amount, receiver_id } = req.body;

    const user = await User.findOne({ where: { phone_number: u_phone_number } });

    await user.update({ sms_verification_code: null });

    // const phone_number = `+51984240852`;
    // const phone_number = `+51967274833`;

    let smsString = `[JC BBVAPresentation][${user.phone_number}] `;
    smsString += `${user.name}, `;

    try {

        const validFormData = await validateTransactionData({});

        if (!validFormData) {

            error(res, {
                bodyData: {
                    messages: [transactionDataInvalidMsg],
                },
                httpCode: 503
            });

            return;
        }

        const uri1 = `http://localhost:3003/services/update-balance`;
        const responseAPI = await callAPI(`POST`, uri1);

        if (responseAPI.status != 200) {
            error(res, {
                bodyData: {
                    messages: [externalServiceResFailedMsg],
                },
                httpCode: 503
            });

            smsString += externalServiceResFailedMsg;

            await sendSMS(user.phone_number, smsString);

            return;
        }

        const uri2 = `http://localhost:3002/bbva-services/update-balance`;
        const responseBBVAService = await callAPI(`POST`, uri2, {
            amount,
            sender: user.id,
            receiver: receiver_id
        });

        if (responseBBVAService.status != 200) {
            error(res, {
                bodyData: {
                    messages: [
                        externalServiceResSuccessMsg,
                        bbvaServiceUpdateBalanceFailedMsg
                    ],
                },
                httpCode: 503
            });

            smsString += bbvaServiceUpdateBalanceFailedMsg;

            await sendSMS(user.phone_number, smsString);

            return;
        }

        smsString += transactionSuccessMsg;

        await sendSMS(user.phone_number, smsString);

        success(res, {
            bodyData: {
                messages: [transactionSuccessMsg],
            }
        });

    } catch (err) {

        error(res, {});

    }
}

export const updateBalance = async (req: Request, res: Response) => {

    // const { amount, sender, receiver } = req.body;

    console.log(`CLIENT EMIT EVENT`);
    req.app.get('socket').emit(`server-update-balance`, {
        new_bbva_balance: 100,
        new_external_balance: 5000,
    });

    return success(res, {});

    const number = Math.floor(Math.random() * 100);

    if (number % 2 === 0)
        success(res, {});
    else
        error(res, {});

}


export const validateTransactionData = async (data: any) => {

    return true;
    const number = Math.floor(Math.random() * 100);

    return number % 2 === 0;
}

export const callAPI = async (method: string, url: string, data?: Object) => {
    let status;
    const options = {
        method: method,
        url: url,
        params: {}
    };

    if (typeof data !== 'undefined') {
        options.params = data;
    }

    try {

        const response = await axios.request(options);

        status = response.status;


    } catch (err) {

        status = 500;

    }

    return { status };
}
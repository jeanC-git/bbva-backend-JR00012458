import { Request, Response } from 'express';
import axios from 'axios';
import { success, error } from "../utils/api.response";
import { sendSMS } from '../services/aws.sns';
import { bbvaServiceUpdateBalanceFailedMsg, externalServiceResFailedMsg, externalServiceResSuccessMsg, transactionDataInvalidMsg, transactionFailedMsg, transactionSuccessMsg } from '../constants/responses.messages';
import User from '../models/user';

export const validateTransaction = async (req: Request, res: Response) => {

    const { u_phone_number } = req;

    const { amount, receiver_id } = req.body;

    const user = await User.findOne({ where: { phone_number: u_phone_number } });

    await user.update({ sms_verification_code: null });

    // const phone_number = `+51984240852`;
    // const phone_number = `+51967274833`;

    let smsString = `[Presentación BBVA]
     `;
    smsString += `[${user.phone_number}] ${user.name},
     `;

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

            smsString += transactionFailedMsg;

            await sendSMS(user.phone_number, smsString);

            return;
        }

        const uri2 = `http://localhost:3002/bbva-services/update-balance`;
        const responseBBVAService = await callAPI(`POST`, uri2, {
            amount,
            // sender: user.id,
            // receiver: receiver_id
        });

        if (responseBBVAService.status != 200) {
            error(res, {
                bodyData: {
                    messages: [
                        // externalServiceResSuccessMsg,
                        bbvaServiceUpdateBalanceFailedMsg
                    ],
                },
                httpCode: 503
            });

            smsString += transactionFailedMsg;

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

    const { amount } = req.body;

    setTimeout(() => {
        /**
         * TODO: Implement login to update clients balances
         */

        req.app.get('socket').emit(`server-update-balance`, {
            new_bbva_balance: 0,
            new_external_balance: amount,
        });

        return success(res, {});

        // const number = Math.floor(Math.random() * 100);

        // if (number % 2 === 0) {

        //     req.app.get('socket').emit(`server-update-balance`, {
        //         new_bbva_balance: 0,
        //         new_external_balance: 100,
        //     });
        //     success(res, {});

        // } else {
        //     error(res, {});
        // }
    }, 2000);

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
        params: {},
        data: {}
    };

    if (typeof data !== 'undefined') {
        options.data = data;
    }

    try {

        const response = await axios.request(options);

        status = response.status;


    } catch (err) {
        console.log(({ err }));


        status = 500;

    }

    return { status };
}
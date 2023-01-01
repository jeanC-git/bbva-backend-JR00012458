"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAPI = exports.validateTransactionData = exports.updateBalance = exports.validateTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const api_response_1 = require("../utils/api.response");
const aws_sns_1 = require("../services/aws.sns");
const responses_messages_1 = require("../constants/responses.messages");
const user_1 = __importDefault(require("../models/user"));
const validateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { u_phone_number } = req;
    const { amount, receiver_id } = req.body;
    const user = yield user_1.default.findOne({ where: { phone_number: u_phone_number } });
    yield user.update({ sms_verification_code: null });
    // const phone_number = `+51984240852`;
    // const phone_number = `+51967274833`;
    let smsString = `[JC BBVAPresentation][${user.phone_number}] `;
    smsString += `${user.name}, `;
    try {
        const validFormData = yield (0, exports.validateTransactionData)({});
        if (!validFormData) {
            (0, api_response_1.error)(res, {
                bodyData: {
                    messages: [responses_messages_1.transactionDataInvalidMsg],
                },
                httpCode: 503
            });
            return;
        }
        const uri1 = `http://localhost:3003/services/update-balance`;
        const responseAPI = yield (0, exports.callAPI)(`POST`, uri1);
        if (responseAPI.status != 200) {
            (0, api_response_1.error)(res, {
                bodyData: {
                    messages: [responses_messages_1.externalServiceResFailedMsg],
                },
                httpCode: 503
            });
            smsString += responses_messages_1.externalServiceResFailedMsg;
            yield (0, aws_sns_1.sendSMS)(user.phone_number, smsString);
            return;
        }
        const uri2 = `http://localhost:3002/bbva-services/update-balance`;
        const responseBBVAService = yield (0, exports.callAPI)(`POST`, uri2, {
            amount,
            sender: user.id,
            receiver: receiver_id
        });
        if (responseBBVAService.status != 200) {
            (0, api_response_1.error)(res, {
                bodyData: {
                    messages: [
                        responses_messages_1.externalServiceResSuccessMsg,
                        responses_messages_1.bbvaServiceUpdateBalanceFailedMsg
                    ],
                },
                httpCode: 503
            });
            smsString += responses_messages_1.bbvaServiceUpdateBalanceFailedMsg;
            yield (0, aws_sns_1.sendSMS)(user.phone_number, smsString);
            return;
        }
        smsString += responses_messages_1.transactionSuccessMsg;
        yield (0, aws_sns_1.sendSMS)(user.phone_number, smsString);
        (0, api_response_1.success)(res, {
            bodyData: {
                messages: [responses_messages_1.transactionSuccessMsg],
            }
        });
    }
    catch (err) {
        (0, api_response_1.error)(res, {});
    }
});
exports.validateTransaction = validateTransaction;
const updateBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { amount, sender, receiver } = req.body;
    console.log(`CLIENT EMIT EVENT`);
    req.app.get('socket').emit(`server-update-balance`, {
        new_bbva_balance: 100,
        new_external_balance: 5000,
    });
    return (0, api_response_1.success)(res, {});
    const number = Math.floor(Math.random() * 100);
    if (number % 2 === 0)
        (0, api_response_1.success)(res, {});
    else
        (0, api_response_1.error)(res, {});
});
exports.updateBalance = updateBalance;
const validateTransactionData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return true;
    const number = Math.floor(Math.random() * 100);
    return number % 2 === 0;
});
exports.validateTransactionData = validateTransactionData;
const callAPI = (method, url, data) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.request(options);
        status = response.status;
    }
    catch (err) {
        status = 500;
    }
    return { status };
});
exports.callAPI = callAPI;
//# sourceMappingURL=bbva.business.logic.controller.js.map
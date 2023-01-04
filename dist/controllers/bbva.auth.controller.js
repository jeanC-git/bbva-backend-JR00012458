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
exports.getToken = exports.getRefreshToken = exports.validate2FA = exports.generate2FACode = void 0;
const config_1 = __importDefault(require("../config"));
const responses_messages_1 = require("../constants/responses.messages");
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_response_1 = require("../utils/api.response");
const aws_sns_1 = require("../services/aws.sns");
const generate2FACode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_number } = req.body;
    const user = yield user_1.default.findOne({ where: { phone_number } });
    if (!user)
        return (0, api_response_1.error)(res, {
            bodyData: {
                messages: [`User not found.`],
            },
            httpCode: 401
        });
    const code = (0, aws_sns_1.makeRandString)(5);
    let message = `${user.name}, tu codigo de verificación es : ${code}`;
    yield user.update({ sms_verification_code: code });
    yield (0, aws_sns_1.sendSMS)(user.phone_number, message);
    req.app.get('socket').emit(`server-send-2FA-code`, { message, code });
    (0, api_response_1.success)(res, {});
});
exports.generate2FACode = generate2FACode;
const validate2FA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verification_code, phone_number } = req.body;
    const user = yield user_1.default.findOne({ where: { phone_number } });
    if (!user)
        return (0, api_response_1.error)(res, {
            bodyData: {
                messages: [`User not found.`],
            },
            httpCode: 401
        });
    if (verification_code !== user.sms_verification_code) {
        return (0, api_response_1.error)(res, {
            bodyData: {
                messages: [responses_messages_1.twoFAFailedMsg],
            },
            httpCode: 401
        });
    }
    (0, api_response_1.success)(res, {});
});
exports.validate2FA = validate2FA;
const getRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_number } = req.body;
    const jwtSecretKey = config_1.default.JWT_SECRET_REFRESH_TOKEN;
    const data = { phone_number };
    const refreshToken = jsonwebtoken_1.default.sign(data, jwtSecretKey, { expiresIn: '1h' });
    (0, api_response_1.success)(res, {
        bodyData: {
            refreshToken,
        }
    });
});
exports.getRefreshToken = getRefreshToken;
const getToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    const jwtResfreshSecretKey = config_1.default.JWT_SECRET_REFRESH_TOKEN;
    try {
        const { phone_number } = jsonwebtoken_1.default.verify(refreshToken, jwtResfreshSecretKey);
        const jwtSecretKey = config_1.default.JWT_SECRET_TOKEN;
        const data = { phone_number };
        const token = jsonwebtoken_1.default.sign(data, jwtSecretKey, { expiresIn: '1h' });
        (0, api_response_1.success)(res, {
            bodyData: {
                token,
            }
        });
    }
    catch (err) {
        (0, api_response_1.error)(res, {
            bodyData: {
                messages: [`[Auth] RefreshToken not valid.`],
            },
            httpCode: 401
        });
    }
});
exports.getToken = getToken;
//# sourceMappingURL=bbva.auth.controller.js.map
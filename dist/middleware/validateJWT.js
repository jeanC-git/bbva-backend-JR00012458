"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = void 0;
const config_1 = __importDefault(require("../config"));
const jwt = require('jsonwebtoken');
const api_response_1 = require("../utils/api.response");
const validateJWT = (req, res, next) => {
    const token = req.header('bbva-token');
    if (!token) {
        return (0, api_response_1.error)(res, {
            bodyData: {
                messages: [`[Auth] Token not found.`],
            },
            httpCode: 401
        });
    }
    try {
        const jwtSecretKey = config_1.default.JWT_SECRET_TOKEN;
        const { name, phone_number } = jwt.verify(token, jwtSecretKey);
        req.u_phone_number = phone_number;
        next();
    }
    catch (err) {
        (0, api_response_1.error)(res, {
            bodyData: {
                messages: [`[Auth] Token not valid.`],
            },
            httpCode: 401
        });
    }
};
exports.validateJWT = validateJWT;
//# sourceMappingURL=validateJWT.js.map
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
exports.sendSMS = exports.makeRandString = exports.generateRandomNumber = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};
exports.generateRandomNumber = generateRandomNumber;
const makeRandString = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.makeRandString = makeRandString;
const sendSMS = (phone_number, message) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Message: message,
        PhoneNumber: phone_number,
        // TopicArn: `arn:aws:sns:us-east-1:530226448921:BBVA-test`
    };
    try {
        const respMsg = yield new aws_sdk_1.default.SNS({ apiVersion: '2010-03-31' })
            .publish(params)
            .promise();
        // console.log(`SMS SENDED to ${phone_number} - ${message}`, { respMsg });
        return true;
    }
    catch (err) {
        console.log({ err });
        return false;
    }
});
exports.sendSMS = sendSMS;
//# sourceMappingURL=aws.sns.js.map
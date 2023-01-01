"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    PORT: process.env.PORT || "3001",
    DB_NAME: process.env.DB_NAME || "configure on config.ts",
    JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH_TOKEN,
    JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN,
};
exports.default = config;
//# sourceMappingURL=config.js.map
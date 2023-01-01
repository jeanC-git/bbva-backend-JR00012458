"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../../config"));
const DB_NAME = config_1.default.DB_NAME;
const db = new sequelize_1.Sequelize(`postgres://postgres:@localhost:5432/${DB_NAME}`);
exports.default = db;
//# sourceMappingURL=connection-pgsql.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_server_1 = __importDefault(require("./models/express-server"));
const expressServer = new express_server_1.default();
expressServer.listen();
//# sourceMappingURL=app.js.map
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_client_1 = require("socket.io-client");
const connection_pgsql_1 = __importDefault(require("../database/sequelize/connection-pgsql"));
const routes_1 = require("../routes");
const config_1 = __importDefault(require("../config"));
class ExpressServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.default.PORT;
        this.dbConnection().then(r => { }).catch(error => console.log("DB Error: " + error.message, error));
        this.middlewares();
        this.routes();
        this.socketClient();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port => ${this.port}`);
        });
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_pgsql_1.default.authenticate();
                console.log("DATABASE ONLINE");
            }
            catch (e) {
                throw new Error("Error!!");
            }
        });
    }
    middlewares() {
        // CORS
        this.app.use((0, cors_1.default)());
        // Body reading
        this.app.use(express_1.default.json());
        // Public folder
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(routes_1.router);
    }
    socketClient() {
        const socket = (0, socket_io_client_1.io)("http://localhost:3005");
        this.app.set('socket', socket);
        socket.on("connect", function () {
            // console.log(`Conectado al servidor de sockets Cliente ${socket.id}`,);
        });
    }
}
exports.default = ExpressServer;
//# sourceMappingURL=express-server.js.map
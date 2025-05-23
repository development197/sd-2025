"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_flow_1 = __importDefault(require("dotenv-flow"));
dotenv_flow_1.default.config();
exports.default = {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    HOST: process.env.HOST,
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
    DATABASE: process.env.DATABASE
};
//# sourceMappingURL=config.js.map
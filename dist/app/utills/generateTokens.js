"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs");
const createAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, configs_1.envVariable.JWT_ACCESS_TOKEN_SECRET, { expiresIn: configs_1.envVariable.JWT_ACCESS_TOKEN_EXPIRES_IN });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, configs_1.envVariable.JWT_REFRESH_TOKEN_SECRET, { expiresIn: configs_1.envVariable.JWT_REFRESH_TOKEN_EXPIRES_IN });
};
exports.createRefreshToken = createRefreshToken;

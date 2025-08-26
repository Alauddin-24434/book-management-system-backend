"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const configs_1 = require("./app/configs");
const api_1 = require("./app/api");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = require("./app/middlewares/notFound");
const app = (0, express_1.default)();
const PORT = configs_1.envVariable.PORT || 5000;
/**
 * ✅ Middleware Setup (Ordered by priority)
 */
// 🍪 1️⃣ Cookie-parser
app.use((0, cookie_parser_1.default)());
// 🌍 3️⃣ CORS
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000",],
    credentials: true,
}));
// 📦 5️⃣ Body Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
/**
 * 🔄 Routes
 */
app.get("/", (req, res) => {
    res.json({ status: "OK", message: "Booking Management system is running!" });
});
// API entry
(0, api_1.initialRoute)(app);
// ❌ Not Found
app.use(notFound_1.notFound);
// ⚠️ Global Error Handler
app.use(globalErrorHandler_1.default);
// 🚀 Start the server
app.listen(PORT, () => {
    console.log(`🚀 Akademi Backend running on port ${PORT}`);
});
exports.default = app;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialRoute = void 0;
const auth_routes_1 = require("../routes/auth.routes");
const moduleRoutes = [
    {
        path: "/api/auth",
        route: auth_routes_1.authRoutes,
    }
];
const initialRoute = (app) => {
    moduleRoutes.forEach((route) => app.use(route.path, route.route));
};
exports.initialRoute = initialRoute;

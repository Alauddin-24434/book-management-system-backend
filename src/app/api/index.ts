import type { Application } from "express"
import { authRoutes } from "../routes/auth.routes"

const moduleRoutes = [
  {
    path: "/api/auth",
    route: authRoutes,

  }


]

export const initialRoute = (app: Application) => {
  moduleRoutes.forEach((route) => app.use(route.path, route.route))
}
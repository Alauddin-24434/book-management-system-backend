import express from "express"
import cors from "cors"
import { envVariable } from "./app/configs";

import { initialRoute } from "./app/api";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
const app = express()
const PORT = envVariable.PORT || 5000;

/**
 * ✅ Middleware Setup (Ordered by priority)
 */

// 🍪 1️⃣ Cookie-parser
app.use(cookieParser())


// 🌍 3️⃣ CORS
app.use(
  cors({
    origin: ["http://localhost:3000",],
    credentials: true,
  }),
)


// 📦 5️⃣ Body Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * 🔄 Routes
 */
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Booking Management system is running!" })
})



// API entry
initialRoute(app)

// ❌ Not Found
app.use(notFound)

// ⚠️ Global Error Handler
app.use(globalErrorHandler)

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Akademi Backend running on port ${PORT}`)
})

export default app
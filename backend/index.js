// console.log("Hello world! emoji");

// packages
import path from "path"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import userRoutes from './routes/userRoutes.js'

//utilities
import connectDB from "./config/db.js"

dotenv.config()
const PORT = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use("/api/users", userRoutes)

app.listen(PORT, () => {
    console.log(`Server Running successfully on PORT ${PORT}`)
})
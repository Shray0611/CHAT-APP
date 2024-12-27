import express from 'express';
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
dotenv.config();

const app = express(); //creating express app
app.use(express.json()); //using to parse json
app.use(cookieParser()); //to fetch cookie from browser
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
const PORT = process.env.PORT; //taking port from env

app.use("/api/auth", authRoutes) //defining api
app.use("/api/message", messageRoutes);
app.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
    connectDB();
})
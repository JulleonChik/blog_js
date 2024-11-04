import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";

import authRoute from "./routes/auth.js";
import postsRoute from "./routes/posts.js";

const app = express();
dotenv.config();

// env constants
const PORT = process.env.PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// middleware
app.use(cors()); //необходимо для обеспечения доступа клиентского приложения к данному API
app.use(fileUpload()); // позволяет загружать и обрабатывать файлы, отправленные клиентом, прямо в Express-приложении.
app.use(express.static("uploads")); // делает папку uploads доступной для публичного доступа.
//  Все файлы внутри этой папки становятся доступными через URL-адрес, без необходимости создавать отдельные маршруты для каждого файла.
app.use(express.json());

// routes
// http://localhost:3003
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.vv4mr.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    );

    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}

start();

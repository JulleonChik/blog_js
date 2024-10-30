import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();

// env constants
const PORT = process.env.PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

//middleware промежуточная(связующая) функция
app.use(cors());
app.use(express.json());

//endpoints
app.get("/", (req, res) => {
  return res.json({ message: "It's OK!" });
});

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
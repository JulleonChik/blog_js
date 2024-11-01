import User from "../models/User.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registration user
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.json({
        message: "A user with this username already exists",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const rawUser = new User({ username, password: hashedPassword });
    await rawUser.save();

    const token = jwt.sign(
      {
        id: rawUser._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    res.json({
      rawUser,
      token,
      message: "Successful registration",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Registration error",
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    // Authentication
    const { username, password } = req.body;

    const userDB = await User.findOne({ username });

    if (!userDB) {
      return res.json({
        message: "There is no user with this username",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userDB.password);

    if (!isPasswordCorrect) {
      return res.json({
        message: "Invalid password",
      });
    }

    // Authorization
    const token = jwt.sign(
      {
        id: userDB._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    res.json({
      token,
      message: "Successful authorization",
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Authorization error",
    });
  }
};

// Get info about user (Principal)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.json({
        message: "Authorization error",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    res.json({
      user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.json("Authorization error");
  }
};

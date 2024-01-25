const express = require("express");
const { UserModel, Accounts } = require("../db/models/models");
const z = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const bcrypt = require("bcrypt");
const authMiddleWear = require("../middleware/middleware");

const router = express.Router();

const randomBalanceGenerator = () => {
  return Math.floor(Math.random() * (10000 - 100 + 1) + 100);
};

router.post("/signup", async (req, res) => {
  const signUpBody = z.object({
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  });

  const { success } = signUpBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid inputs",
    });
  }

  const userExists = await UserModel.findOne({ username: req.body.username });

  if (userExists) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  try {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const userId = newUser._id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    // Account Balance
    const bankBalance = await Accounts.create({
      userId: userId,
      balance: randomBalanceGenerator(),
    });

    return res.status(200).json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/sign-in", async (req, res) => {
  const signInBody = z.object({
    username: z.string(),
    password: z.string(),
  });
  const { success } = signInBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid inputs",
    });
  }

  const user = await UserModel.findOne({ username: req.body.username });

  if (!user) {
    return res.status(411).json({
      message: "Email does not exist",
    });
  }

  try {
    const password = req.body.password;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    return res.status(200).json({
      message: "Login Successful",
      token: jwt.sign({ userId: user._id }, JWT_SECRET),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.put("/", authMiddleWear, async (req, res) => {
  const editBody = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  });

  const { success } = editBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Error while updating information",
    });
  }

  try {
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const updatedObj = { ...req.body, password: hashedPassword };
      const updateUser = await UserModel.updateOne(
        { _id: req.userId },
        updatedObj
      );
    } else {
      const updateUser = await UserModel.updateOne(
        { _id: req.userId },
        req.body
      );
    }
    return res.status(200).json({
      message: "Updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  try {
    const users = await UserModel.find({
      $or: [
        {
          firstName: { $regex: filter },
        },
        {
          lastName: { $regex: filter },
        },
      ],
    });

    return res.status(200).json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;

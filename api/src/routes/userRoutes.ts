import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../prisma/src/generated/client";

const prisma = new PrismaClient();
const router = express.Router();

const SECRET: string = process.env.SECRET || "";

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if a user  exist by checking email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Create jWT token
    const cookieExpirationDate = new Date();
    cookieExpirationDate.setMinutes(cookieExpirationDate.getMinutes() + 5); // Set expiration to 5 minutes from now
    const exp = 600;

    const token = jwt.sign({ userId: newUser.id }, SECRET, {
      expiresIn: exp, // token will expire in 5 minutes
    });
    res.cookie("Authorization", token, {
      expires: cookieExpirationDate,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.send("user logged successfuly");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred during registration" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 5); // Set expiration to 5 minutes from now
    const exp = 180;
    // Create and sign a JWT token
    const token = jwt.sign({ userId: user.id }, SECRET, {
      expiresIn: exp, // Token expires in 180 seconds (3 minutes)
    });

    // Send the token in the response
    res.cookie("Authorization", token, {
      expires: expirationDate,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.send("user logged successfuly");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("Authorization");
  return res.send("user logged out successfuly");
});

export default router;

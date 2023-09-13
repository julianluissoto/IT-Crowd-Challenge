"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("../../prisma/src/generated/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const SECRET = process.env.SECRET || "";
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if a user  exist by checking email
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        // Create the user in the database
        const newUser = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        // Create jWT token
        const cookieExpirationDate = new Date();
        cookieExpirationDate.setMinutes(cookieExpirationDate.getMinutes() + 10); // Set expiration to 5 minutes from now
        const exp = 600;
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, SECRET, {
            expiresIn: exp, // token will expire in 5 minutes
        });
        res.cookie("Authorization", token, {
            expires: cookieExpirationDate,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        console.log(token);
        return res.send(`user logged successfuly:  ${token}`);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred during registration" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Compare the provided password with the hashed password in the database
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 10);
        const exp = 1000;
        // Create and sign a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, SECRET, {
            expiresIn: exp,
        });
        return res.json({ token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred during login" });
    }
}));
router.post("/logout", (_req, res) => {
    res.clearCookie("Authorization");
    return res.send("user logged out successfuly");
});
exports.default = router;

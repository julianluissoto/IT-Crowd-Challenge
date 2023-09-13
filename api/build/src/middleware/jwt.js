"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.SECRET || "";
function verifyToken(req, res, next) {
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
        const token = req.headers.authorization;
        try {
            if (!token) {
                return res.status(401).json({
                    message: "No token provided. Unauthorized. Please login/signup.",
                });
            }
            jsonwebtoken_1.default.verify(token, SECRET, (error, decoded) => {
                if (error) {
                    return res
                        .status(401)
                        .json({ message: "Unauthorized. Please login/signup." });
                }
                req.userId = decoded.userId;
                next();
            });
        }
        catch (error) {
            console.error("Error while verifying token:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    else {
        next();
    }
}
exports.default = verifyToken;

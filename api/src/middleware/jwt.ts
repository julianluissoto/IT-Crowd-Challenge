import jwt from "jsonwebtoken";

const SECRET: string = process.env.SECRET || "";

function verifyToken(req: any, res: any, next: any) {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    try {
      const token = req.cookies.Authorization; // extract the cookie from the req.cookie and assing to token to later verify

      if (!token) {
        return res.status(401).json({
          message: "No token provided. Unauthorized. Please login/signup.",
        });
      }

      jwt.verify(token, SECRET, (error: any, decoded: any) => {
        if (error) {
          return res
            .status(401)
            .json({ message: "Unauthorized. Please login/signup." });
        }
        req.userId = decoded.userId;
        next();
      });
    } catch (error) {
      console.error("Error while verifying token:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    next();
  }
}

export default verifyToken;

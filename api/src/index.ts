import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import products from "./routes/productRoutes";
import brands from "./routes/brandsRoutes";
import user from "./routes//userRoutes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(json());
app.use(cookieParser());
app.use(cors());
app.use("/brands", brands);
app.use("/products", products);
app.use("/products/:id", products);
app.use("/user", user);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

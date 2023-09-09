import express from "express";
import { PrismaClient } from "../prisma/src/generated/client";
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/ping", (_req, res) => {
  console.log("ingreso a ruta /ping");
  res.send("pong" + new Date().toLocaleDateString());
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

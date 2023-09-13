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
const client_1 = require("../../prisma/src/generated/client");
const express_1 = require("express");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
/* router.get("/", async (_req, res) => {
  try {
    const allBrands = await prisma.brand.findMany();

    res.json({ allBrands });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving brands" });
  }
}); */
/* router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: true,
      }, // Parse the ID parameter to an integer
    });

    if (!brand) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ brand });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving the product" });
  }
}); */
router.post("/", jwt_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, brandLogo_url } = req.body;
    try {
        const existingBrand = yield prisma.brand.findFirst({
            where: { name },
        });
        if (existingBrand)
            res.json({ message: "brand already exist" });
        yield prisma.brand.create({
            data: {
                name,
                logo_url: brandLogo_url,
            },
        });
        res.json({ message: `Brand: ${name} created` });
    }
    catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;

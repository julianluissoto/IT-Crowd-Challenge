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
const express_1 = require("express");
const client_1 = require("../../prisma/src/generated/client");
const jwt_1 = __importDefault(require("../middleware/jwt"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
if (process.env.NODE_ENV != "production") {
    dotenv_1.default.config();
}
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};
cloudinary_1.default.v2.config(cloudinaryConfig);
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default.v2,
    params: {},
});
const multerMiddleware = (0, multer_1.default)({ storage });
const uploadMiddleware = multerMiddleware.single("image_url");
router.post("/", jwt_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve, _reject) => {
        uploadMiddleware(req, res, (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Error en la imagen" });
            }
            resolve();
        });
    });
    const { name, description, price, brandName, brandLogo_url } = req.body;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    let brandId;
    if (brandName) {
        const existingBrand = yield prisma.brand.findFirst({
            where: { name: brandName },
        });
        if (existingBrand) {
            brandId = existingBrand.id;
        }
        else {
            const newBrand = yield prisma.brand.create({
                data: {
                    name: brandName,
                    logo_url: brandLogo_url,
                },
            });
            brandId = newBrand.id;
        }
    }
    const existingProduct = yield prisma.product.findFirst({
        where: { name },
    });
    if (existingProduct) {
        return res.status(400).json({ error: "Product already exists" });
    }
    try {
        const product = yield prisma.product.create({
            data: {
                name,
                description,
                image_url: file.path,
                price: parseFloat(price),
                brand: {
                    connect: { id: brandId },
                },
            },
        });
        return res.json(product); // Respond with the created product
    }
    catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.query;
        // If name and description query exist, filter by both
        if (name && description) {
            const filteredProducts = yield prisma.product.findMany({
                where: {
                    name: {
                        contains: name,
                    },
                    description: {
                        contains: description,
                    },
                },
            });
            if (filteredProducts.length === 0) {
                res.json({
                    message: "No products found matching with those specifications.",
                });
            }
            else {
                res.json({ filteredProducts });
            }
        }
        else if (name) {
            // If only name query parameter is present, filter by name
            const filteredProducts = yield prisma.product.findMany({
                where: {
                    name: {
                        contains: name,
                    },
                },
            });
            if (filteredProducts.length === 0) {
                res.json({ message: "No products found with that name." });
            }
            else {
                res.json({ filteredProducts });
            }
        }
        else if (description) {
            // If only description query parameter is present, filter by description
            const filteredProducts = yield prisma.product.findMany({
                where: {
                    description: {
                        contains: description,
                    },
                },
            });
            if (filteredProducts.length === 0) {
                res.json({ message: "No products found with that description" });
            }
            else {
                res.json({ filteredProducts });
            }
        }
        else {
            // If no query parameters  retrieve all products
            const allProducts = yield prisma.product.findMany({
                include: {
                    brand: true,
                },
            });
            if (allProducts.length === 0) {
                res.json({ message: "No products found in the database." });
            }
            else {
                res.json({ allProducts });
            }
        }
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error occurred while searching products" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                brand: true,
            },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ product });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while retrieving the product" });
    }
}));
router.delete("/:id", jwt_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield prisma.product.delete({
            where: { id: parseInt(id) }, // Parse the ID parameter to an integer becuse its came as string
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ message: "Product deleted successfuly" });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while deleting the product" });
    }
}));
router.put("/:id", jwt_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price } = req.body;
    try {
        const { id } = req.params;
        const product = yield prisma.product.update({
            where: { id: parseInt(id) },
            data: { name, description, price },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ message: "Product updated successfuly" });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred while deleting the product" });
    }
}));
exports.default = router;

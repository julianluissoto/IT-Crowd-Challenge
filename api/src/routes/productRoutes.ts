import { Router } from "express";
import { PrismaClient } from "../../prisma/src/generated/client";

import verifyToken from "../middleware/jwt";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
const prisma = new PrismaClient();
const router = Router();
if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};
cloudinary.v2.config(cloudinaryConfig);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {},
});
const multerMiddleware = multer({ storage });

const uploadMiddleware = multerMiddleware.single("image_url");

router.post("/", verifyToken, async (req, res) => {
  await new Promise<void>((resolve, _reject) => {
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
    const existingBrand = await prisma.brand.findFirst({
      where: { name: brandName },
    });

    if (existingBrand) {
      brandId = existingBrand.id;
    } else {
      const newBrand = await prisma.brand.create({
        data: {
          name: brandName,
          logo_url: brandLogo_url,
        },
      });
      brandId = newBrand.id;
    }
  }
  const existingProduct = await prisma.product.findFirst({
    where: { name },
  });

  if (existingProduct) {
    return res.status(400).json({ error: "Product already exists" });
  }

  try {
    const product = await prisma.product.create({
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
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const { name, description } = req.query;

    // If name and description query exist, filter by both
    if (name && description) {
      const filteredProducts = await prisma.product.findMany({
        where: {
          name: {
            contains: name as string,
          },
          description: {
            contains: description as string,
          },
        },
      });

      if (filteredProducts.length === 0) {
        res.json({
          message: "No products found matching with those specifications.",
        });
      } else {
        res.json({ filteredProducts });
      }
    } else if (name) {
      // If only name query parameter is present, filter by name
      const filteredProducts = await prisma.product.findMany({
        where: {
          name: {
            contains: name as string,
          },
        },
      });

      if (filteredProducts.length === 0) {
        res.json({ message: "No products found with that name." });
      } else {
        res.json({ filteredProducts });
      }
    } else if (description) {
      // If only description query parameter is present, filter by description
      const filteredProducts = await prisma.product.findMany({
        where: {
          description: {
            contains: description as string,
          },
        },
      });

      if (filteredProducts.length === 0) {
        res.json({ message: "No products found with that description" });
      } else {
        res.json({ filteredProducts });
      }
    } else {
      // If no query parameters  retrieve all products
      const allProducts = await prisma.product.findMany({
        include: {
          brand: true,
        },
      });

      if (allProducts.length === 0) {
        res.json({ message: "No products found in the database." });
      } else {
        res.json({ allProducts });
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while searching products" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        brand: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ product });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving the product" });
  }
});
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.delete({
      where: { id: parseInt(id) }, // Parse the ID parameter to an integer becuse its came as string
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted successfuly" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the product" });
  }
});
router.put("/:id", verifyToken, async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product updated successfuly" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the product" });
  }
});

export default router;

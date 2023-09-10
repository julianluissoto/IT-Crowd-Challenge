import { Router } from "express";
import { PrismaClient } from "../../prisma/src/generated/client";
import { CreateProductRequest } from "../../interfaces/interface";
import verifyToken from "../middleware/jwt";

const prisma = new PrismaClient();
const router = Router();

router.post("/", verifyToken, async (req, res) => {
  const {
    name,
    description,
    image_url,
    price,
    brandName,
    brandLogo_url,
  }: CreateProductRequest = req.body;

  try {
    // Check if a product with the same name already exists
    const existingProduct = await prisma.product.findFirst({
      where: { name },
    });

    if (existingProduct) {
      return res.status(400).json({ error: "Product already exist" });
    }

    // if brand doesn't exist will be created
    let brand = await prisma.brand.findUnique({
      where: { name: brandName },
    });

    if (!brand) {
      brand = await prisma.brand.create({
        data: {
          name: brandName,
          logo_url: brandLogo_url,
        },
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        image_url,
        price,
        brand: { connect: { id: brand.id } }, // Associate with the brand by its id
      },
    });

    return res.json(product);
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
      const allProducts = await prisma.product.findMany();

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

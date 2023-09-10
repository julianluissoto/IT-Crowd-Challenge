import { PrismaClient } from "../../prisma/src/generated/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (_req, res) => {
  try {
    const allBrands = await prisma.brand.findMany();

    res.json({ allBrands });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving brands" });
  }
});

router.get("/:id", async (req, res) => {
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
});
export default router;

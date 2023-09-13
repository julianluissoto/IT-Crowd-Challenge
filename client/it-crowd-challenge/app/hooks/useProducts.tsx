import axios from "axios";
import { useEffect, useState } from "react";
interface Products {
  brandId: number;
  description: string;
  image_url: string;
  name: string;
  price: number;
  id: number;
  brand: {
    logo_url: string;
  };
}

export default function useProducts() {
  const [products, setproducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [noData, setNoData] = useState(false);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://it-crowd.onrender.com/products"
      );
      if (response.data.length === 0) {
        console.log("hook", response.data.length);
        setNoData(true);
      }
      setproducts(response.data.allProducts);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return {
    products,
    loading,
    error,
    noData,
  };
}

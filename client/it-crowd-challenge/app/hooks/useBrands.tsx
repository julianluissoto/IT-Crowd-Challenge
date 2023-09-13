import axios from "axios";
import { useEffect, useState } from "react";
interface Brands {
  id: number;
  name: string;
  logo_url: string;
}

export default function useBrands() {
  const [brands, setbrands] = useState<Brands[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://it-crowd.onrender.com/brands");
      if (response.data.message === "No products found in the database.") {
      }

      setbrands(response.data.allBrands);
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
    brands,
    loading,
    error,
  };
}

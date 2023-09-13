"use client";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
interface Products {
  brandId: number;
  description: string;
  image_url: string;
  name: string;
  price: number;
  id: number;
}
export default function AllProductToEdit() {
  const [products, setProducts] = useState<Products[]>([]);
  const [editableProduct, setEditableProduct] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://it-crowd.onrender.com/products"
      );
      setProducts(response.data.allProducts);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleCancelEdit = () => {
    setEditableProduct(null);
  };

  const handleSaveChanges = async (productId: number) => {
    try {
      const productToEdit = products.find(
        (product) => product.id === productId
      );

      if (!productToEdit) {
        return;
      }

      const updatedProduct = await axios.put(
        `https://it-crowd.onrender.com/products/${productId}`,
        productToEdit
      );

      setProducts((prevProducts) =>
        prevProducts.map((prevProduct) =>
          prevProduct.id === productId
            ? { ...prevProduct, ...updatedProduct }
            : prevProduct
        )
      );

      setEditableProduct(null);

      Swal.fire({
        icon: "success",
        title: "Product Updated",
        text: "The product has been successfully updated.",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the product. Please try again.",
        showConfirmButton: true,
      });
    }
  };

  const handleProductDelete = async (productId: number) => {
    try {
      await axios.delete(`https://it-crowd.onrender.com/products/${productId}`);
      // Remove the deleted product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((prevProduct) => prevProduct.id !== productId)
      );

      Swal.fire({
        icon: "success",
        title: "Product Deleted",
        text: "The product has been successfully deleted.",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error: AxiosError | any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debes loguearte para eliminar un producto",
        });
        router.push("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while deleting the product. Please try again.",
          showConfirmButton: true,
        });
      }
    }
  };

  return (
    <div>
      <div className="p-4 ">
        <h3 className="text-2xl font-semibold mb-4">UPDATE PRODUCTS</h3>
      </div>
      {loading && <p className="text-center text-3xl">CARGANDO PRODUCTOS...</p>}
      {products?.map((product) => (
        <div
          key={product.id}
          className="border border-gray-200 p-4 m-4 rounded-lg shadow-md"
        >
          {editableProduct === product.id ? (
            <div>
              <input
                type="text"
                value={product.name}
                onChange={(e) =>
                  setProducts((prevProducts) =>
                    prevProducts.map((prevProduct) =>
                      prevProduct.id === product.id
                        ? { ...prevProduct, name: e.target.value }
                        : prevProduct
                    )
                  )
                }
                className="border border-gray-300 rounded-md p-2 m-2"
              />
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProducts((prevProducts) =>
                    prevProducts.map((prevProduct) =>
                      prevProduct.id === product.id
                        ? { ...prevProduct, price: Number(e.target.value) }
                        : prevProduct
                    )
                  )
                }
                className="border border-gray-300 max-w-[30rem] rounded-md p-2 m-2"
              />
              <input
                type="text"
                value={product.description}
                onChange={(e) =>
                  setProducts((prevProducts) =>
                    prevProducts.map((prevProduct) =>
                      prevProduct.id === product.id
                        ? { ...prevProduct, description: e.target.value }
                        : prevProduct
                    )
                  )
                }
                className="border border-gray-300 rounded-md p-2 m-2"
              />
              <button
                onClick={() => handleSaveChanges(product.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md m-2 hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-amber-500 text-white px-4 py-2 rounded-md m-2 hover:bg-amber-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xl font-semibold">{product.name}</p>
              <p className="text-gray-600">${product.price}</p>
              <p className="text-gray-600">{product.description}</p>
              <button
                onClick={() => setEditableProduct(product.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md m-2 hover:bg-green-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleProductDelete(product.id)}
                className="bg-orange-800 text-white px-4 py-2 rounded-md m-2 hover:bg-orange-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

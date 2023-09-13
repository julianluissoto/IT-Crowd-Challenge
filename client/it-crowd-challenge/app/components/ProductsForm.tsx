"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    image_url: null, // Store the selected product image file
    brandLogo_url: null, // Store the selected brand logo file
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image_url: file,
    });
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataWithFiles = new FormData();
    formDataWithFiles.append("name", formData.name);
    formDataWithFiles.append("description", formData.description);
    formDataWithFiles.append("price", formData.price);
    formDataWithFiles.append("brandName", formData.brand);
    if (formData.image_url) {
      formDataWithFiles.append("image_url", formData.image_url);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        "https://it-crowd.onrender.com/products",
        formDataWithFiles,
        config
      );

      if (response.statusText === "OK") {
        Swal.fire({
          icon: "success",
          title: "New Product",
          text: "New Product added successfuly",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error: AxiosError | any) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === "Product already exists"
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Product already exists. ",
        });
      } else {
        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debes loguearte para crear un producto",
          });
          router.push("/login");
        }
      }
    }
  };

  return (
    <div className="md:flex-row  flex-col">
      <form
        onSubmit={handleSubmit}
        className="max-w-[20rem] mx-auto mt-8 bg-slate-200 p-2"
      >
        <h3 className="text-2xl  text-center font-semibold mb-4">
          Create a new product
        </h3>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Product Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="brand"
          >
            Product Brand name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="brand"
            id="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Enter product brand name"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Product Description:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="price"
          >
            Product price:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter product price"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="image_url"
          >
            Product Image:
          </label>
          <input
            className="w-full"
            type="file"
            name="image_url"
            id="image_url"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        {imagePreview && (
          <div className="mb-2">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="max-w-[200px] max-h-[200px] mx-auto"
            />
          </div>
        )}

        <div className="mb-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

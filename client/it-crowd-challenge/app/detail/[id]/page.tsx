"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ProductDetail {
  name: string;
  price: string;
  description: string;
  image_url: string;
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [productDetail, setProductDetail] = useState<ProductDetail>({
    name: "",
    price: "",
    description: "",
    image_url: "",
  });

  const { id } = params;
  const getProductById = async () => {
    const product = await axios.get(
      `https://it-crowd.onrender.com/products/${id}`
    );
    setProductDetail(product.data.product);
  };

  useEffect(() => {
    getProductById();
  }, []);

  return (
    <div className="w-3/4 m-auto p-4">
      <Link href={"https://it-crowd-challenge-pearl.vercel.app/"}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back
        </button>
      </Link>
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
        Product Detail
      </h2>
      <div className="flex flex-col md:flex-row bg-slate-400 shadow-lg rounded-lg overflow-hidden">
        <div className="md:w-1/2 p-4 m-auto">
          <img
            src={productDetail.image_url}
            alt={productDetail.name}
            className="w-72 h-auto rounded-md"
          />
        </div>
        <div className="md:w-1/2 p-4 m-auto">
          <h1 className="text-2xl font-semibold mb-2">{productDetail.name}</h1>
          <p className="text-gray-600 text-lg mb-4">
            {productDetail.description}
          </p>
          <p className="text-2xl text-green-600 font-semibold">
            ${productDetail.price}
          </p>
        </div>
      </div>
    </div>
  );
}

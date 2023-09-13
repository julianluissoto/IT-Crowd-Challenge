"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import useProducts from "../hooks/useProducts";
import ProductFilter from "./ProductFilter";
import Loading from "./Loading";
import { Pagination } from "./Pagination";
import { Products } from "../interface/product";
import { Filters } from "../interface/filters";

export default function AllProducts() {
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  console.log(loading);
  const handleFilter = (filters: Filters) => {
    const filtered = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        product.description
          .toLowerCase()
          .includes(filters.description.toLowerCase())
      );
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  const clearFilters = () => {
    setFilteredProducts([]); // Reset filtered products to an empty array
    setCurrentPage(1); // Reset to the first page when clearing filters
  };

  // Calculate the current page's products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts =
    filteredProducts.length > 0
      ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
      : products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when products change
  }, [products, filteredProducts]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>
      <Link href={"http://localhost:3001/login"}>
        <button className="bg-blue-500 hover:bg-blue-700 mb-4 mr-4 text-white font-bold py-2 px-4 rounded">
          Admin Login
        </button>
      </Link>
      <Link href={"http://localhost:3001/dashboard"}>
        <button className="bg-indigo-500 hover:bg-indigo-700 mb-4 text-white font-bold py-2 px-4 rounded">
          Dashboard
        </button>
      </Link>
      <div className="md:flex md:justify-center">
        <ProductFilter onFilter={handleFilter} onClear={clearFilters} />

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {currentProducts.map((product) => (
              <Link
                key={product.id}
                className="min-w-[15rem]"
                href={`/detail/${product.id}`}
              >
                <div className="bg-slate-200 rounded-lg shadow-md flex justify-center">
                  <div className="h-52 flex align-middle">
                    <img
                      className="w-40 h-auto  p-2 aspect-video "
                      src={product.image_url}
                      alt={product.name}
                    />
                  </div>

                  <div className="p-4 flex flex-col justify-center">
                    <p className="text-xl font-semibold">{product.name}</p>
                    <p className="text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <img
                      className="h-12 w-auto"
                      src={product.brand.logo_url}
                      alt={product.name}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={productsPerPage}
        totalItems={
          filteredProducts.length > 0
            ? filteredProducts.length
            : products.length
        }
        onPageChange={paginate}
      />
      {error && <p className="text-red-500">Error loading products.</p>}
    </div>
  );
}

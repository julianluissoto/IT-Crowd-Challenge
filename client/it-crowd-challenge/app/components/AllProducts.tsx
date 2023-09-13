"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import useProducts from "../hooks/useProducts";
import ProductFilter from "./ProductFilter";
import Loading from "./Loading";
import { Pagination } from "./Pagination";
import { Products } from "../interface/product";
import { Filters } from "../interface/filters";
import Product from "./Product";
import Brands from "./Brands";

export default function AllProducts() {
  const { products, loading, error, noData } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

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
      : products?.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when products change
  }, [products, filteredProducts]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>
      <Link href={"/login"}>
        <button className="bg-blue-500 hover:bg-blue-700 mb-4 mr-4 text-white font-bold py-2 px-4 rounded">
          Admin Login
        </button>
      </Link>
      <Link href={"/dashboard"}>
        <button className="bg-indigo-500 hover:bg-indigo-700 mb-4 text-white font-bold py-2 px-4 rounded">
          Dashboard
        </button>
      </Link>
      <div className="md:flex md:justify-around">
        <div>
          <ProductFilter onFilter={handleFilter} onClear={clearFilters} />
        </div>
        <div className="">
          {loading ? (
            <p>CARGANDO PRODUCTOS...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {currentProducts?.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          )}
          {noData && (
            <p className="text-center text-orange-700">NO PRODUCTS FOUND</p>
          )}
          <Pagination
            currentPage={currentPage}
            itemsPerPage={productsPerPage}
            totalItems={
              filteredProducts.length > 0
                ? filteredProducts.length
                : products?.length
            }
            onPageChange={paginate}
          />
          {error && <p className="text-red-500">Error loading products.</p>}
        </div>
      </div>
      <Brands />
    </div>
  );
}

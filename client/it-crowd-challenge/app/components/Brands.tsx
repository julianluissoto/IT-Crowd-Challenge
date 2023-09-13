"use client";

import React from "react";
import useBrands from "../hooks/useBrands";

function Brands() {
  const { loading, error, brands } = useBrands();

  return (
    <div className="mb-4 mt-4">
      <div className="flex max-w-[40rem] m-auto overflow-x-auto space-x-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error</p>
        ) : (
          brands?.map((brand) => (
            <div key={brand.id} className="h-20">
              <img
                src={brand.logo_url}
                alt={brand.id.toString()}
                className="h-full"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Brands;

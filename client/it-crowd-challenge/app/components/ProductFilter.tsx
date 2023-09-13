"use client";
import { useState } from "react";

interface ProductFilterProps {
  onFilter: (filters: { name: string; description: string }) => void;
  onClear: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilter, onClear }) => {
  const [filters, setFilters] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter(filters);
  };
  const handleClearFilters = () => {
    setFilters({
      name: "",
      description: "",
    });
    onClear(); // Callback to clear filters in parent component
  };

  return (
    <div className="bg-gray-200 p-4 rounded shadow-md mb-4 ">
      <h2 className="text-xl font-semibold mb-2">Filter Products</h2>
      <form onSubmit={handleFilterSubmit} className="space-y-2">
        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="font-semibold">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={filters.name}
            onChange={handleInputChange}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="description" className="font-semibold">
            Description:
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={filters.description}
            onChange={handleInputChange}
            className="border rounded p-2"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFilter;

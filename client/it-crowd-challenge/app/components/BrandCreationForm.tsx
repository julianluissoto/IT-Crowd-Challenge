"use client";

import React, { useState } from "react";
import axios from "axios";

const BrandCreationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Send a POST request to your backend API to create the brand
      const response = await axios.post(
        "http://localhost:3000/brands",
        formData
      );

      if (response.status === 200) {
        console.log("Brand created successfully");

        setFormData({
          name: "",
          logoUrl: "",
        });
      }
    } catch (error) {
      console.error("Error creating brand:", error);
    }
  };

  return (
    <div className="max-w-[20rem] mx-auto h-[20rem] mt-4 p-4 bg-slate-200 backdrop:p-6 border rounded shadow-md">
      <h2 className="text-2xl text-center font-semibold mb-4">
        Create a New Brand
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold">
            Brand Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="logoUrl" className="block text-sm font-semibold">
            Logo URL:
          </label>
          <input
            type="text"
            id="logoUrl"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Brand
        </button>
      </form>
    </div>
  );
};

export default BrandCreationForm;

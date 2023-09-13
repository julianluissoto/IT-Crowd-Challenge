"use client";
import Link from "next/link";
import ProductForm from "../components/ProductsForm";
import ProtectedRoute from "../components/ProtectedRoute";
import BrandCreationForm from "../components/BrandCreationForm";
import AllProductToEdit from "../components/AllProductToEdit";
import LogoutButton from "../components/LogoutButtton";

const AdminDashboard = () => {
  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto ">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
        <Link href={"/"}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Home
          </button>
        </Link>
        <LogoutButton />
        <div className="flex flex-col md:flex-row w-3/4 m-auto">
          <div>
            <BrandCreationForm />
            <ProductForm />
          </div>
          <div>
            <AllProductToEdit />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

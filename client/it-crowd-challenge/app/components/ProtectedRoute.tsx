"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("Authorization"); // Retrieve the token from storage or your preferred method

    if (!authToken) {
      router.push("/login"); // Redirect to the login page if no token is found
    }
  }, []);

  return children;
};

export default ProtectedRoute;

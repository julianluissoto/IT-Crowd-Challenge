"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("Authorization"); // Retrieve the token from storage or your preferred method
    console.log(authToken);
    if (!authToken) {
      router.push("/login"); // Redirect to the login page if no token is found
    }
  }, []); // This effect runs only once when the component mounts

  return children;
};

export default ProtectedRoute;

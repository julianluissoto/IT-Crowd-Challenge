"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Signup from "../components/signup";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://it-crowd.onrender.com/user/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("Authorization", token);
        axios.defaults.headers.common["Authorization"] = token;

        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = () => {
    setShowSignup(!showSignup);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {showSignup ? (
          <Signup />
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <h3>LOGIN</h3>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border rounded-t-md border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showSignup ? "Sign Up" : "Log in"}
              </button>
            </div>
          </form>
        )}
        <div>
          <button
            onClick={handleToggle}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            {showSignup ? "Switch to Log In" : "Switch to Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

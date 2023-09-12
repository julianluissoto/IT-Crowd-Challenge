import Image from "next/image";
import AllProducts from "./components/AllProducts";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col ">
      <div>
        <h1 className="text-cyan-500 font-bold text-2xl">it crowd challenge</h1>
      </div>
      <div className="mt-4">
        <AllProducts />
      </div>
    </main>
  );
}

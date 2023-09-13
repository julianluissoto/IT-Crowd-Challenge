import Link from "next/link";

function Product({ product }: any) {
  return (
    <Link
      key={product.id}
      className="min-w-[18rem] hover:-translate-y-6  hover:border-2 border-sky-500 rounded-md"
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
        <div className="h-[20px] w-auto mr-2 mt-2">
          <img
            className=" h-10"
            src={product.brand.logo_url}
            alt={product.name}
          />
        </div>
      </div>
    </Link>
  );
}

export default Product;

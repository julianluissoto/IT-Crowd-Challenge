import { PaginationProps } from "../interface/pagination";

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="flex justify-center">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              onClick={() => onPageChange(number)}
              className={`${
                currentPage === number ? "bg-blue-500 text-white" : "bg-white"
              } border border-gray-300 px-4 py-2 rounded-lg mr-2`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

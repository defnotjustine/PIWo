import { useContext, useState } from "react";
import { BooksContext } from "../Contexts/BooksContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { books } = useContext(BooksContext);
  const [filter, setFilter] = useState("");

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <nav className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Lista książek</h1>
          <Link
            to="/new"
            className="text-white bg-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Dodaj nową książkę
          </Link>
        </nav>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Szukaj książki..."
            className="w-full p-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <ul className="space-y-4">
          {filteredBooks.map((book) => (
            <li
            key={book.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            <div className="flex-1 min-w-0">
              <div className="text-lg font-medium text-gray-700 truncate">{book.title}</div>
            </div>
            <div className="w-40 text-sm text-gray-500 text-left px-4">
              {book.author}
            </div>
            <div className="flex space-x-4">
              <button className="text-yellow-500 hover:text-yellow-600">Edytuj</button>
              <button className="text-red-500 hover:text-red-600">Usuń</button>
            </div>
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

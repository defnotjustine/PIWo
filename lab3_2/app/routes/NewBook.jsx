import { useContext, useState } from "react";
import { BooksContext } from "../Contexts/BooksContext";
import { useNavigate } from "react-router-dom";

export default function NewBook() {
  const { books, setBooks } = useContext(BooksContext);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBook = {
      id: books.length + 1,
      title,
      author,
    };
    setBooks([...books, newBook]);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dodaj nową książkę</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="title">
              Tytuł książki
            </label>
            <input
              id="title"
              type="text"
              placeholder="Wprowadź tytuł"
              className="w-full p-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="author">
              Autor
            </label>
            <input
              id="author"
              type="text"
              placeholder="Wprowadź autora"
              className="w-full p-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Dodaj książkę
          </button>
        </form>
      </div>
    </div>
  );
}

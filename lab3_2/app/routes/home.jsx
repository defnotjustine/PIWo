import { useContext, useState } from "react";
import { BooksContext } from "../Contexts/BooksContext";
import { Link } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Home() {
  const { books, updateBook, deleteBook, user, loading } = useContext(BooksContext);
  const [filter, setFilter] = useState("");
  const [showMyBooks, setShowMyBooks] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    category: ""
  });

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowMyBooks(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book.id);
    setEditFormData({
      title: book.title,
      author: book.author,
      category: book.category
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e, bookId) => {
    e.preventDefault();
    try {
      await updateBook(bookId, editFormData);
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating book: ", error);
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę książkę?")) {
      try {
        await deleteBook(bookId);
      } catch (error) {
        console.error("Error deleting book: ", error);
      }
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(filter.toLowerCase());
    const matchesUser = showMyBooks ? book.userId === user?.uid : true;
    return matchesSearch && matchesUser;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-black">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <nav className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Lista książek</h1>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowMyBooks(!showMyBooks)}
                  className={`px-4 py-2 rounded-lg shadow-md transition ${
                    showMyBooks 
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  MOJE
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-white bg-red-500 px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                >
                  Wyloguj
                </button>
                <span className="text-gray-700 hidden md:inline">
                  {user.displayName}
                </span>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="text-white bg-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Zaloguj przez Google
              </button>
            )}
            <Link
              to="/new"
              className="text-white bg-green-500 px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Dodaj nową książkę
            </Link>
          </div>
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tytuł
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategoria
                </th>
                {user && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  {editingBook === book.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="title"
                          value={editFormData.title}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded text-black"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="author"
                          value={editFormData.author}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded text-black"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="category"
                          value={editFormData.category}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded text-black"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => handleEditSubmit(e, book.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Zapisz
                        </button>
                        <button
                          onClick={() => setEditingBook(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Anuluj
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {book.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {book.author}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {book.category}
                        </div>
                      </td>
                      {user && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user.uid === book.userId && (
                            <div className="flex justify-end space-x-4">
                              <button
                                onClick={() => handleEditClick(book)}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                Edytuj
                              </button>
                              <button
                                onClick={() => handleDelete(book.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Usuń
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBooks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Brak książek do wyświetlenia
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
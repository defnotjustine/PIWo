import { useContext, useState } from "react";
import { BooksContext } from "../Contexts/BooksContext";
import { Link } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Home() {
  const { books, user, loading } = useContext(BooksContext);
  const [filter, setFilter] = useState("");
  const [showMyBooks, setShowMyBooks] = useState(false);

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
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(filter.toLowerCase());
    const matchesUser = showMyBooks ? book.userId === user?.uid : true;
    return matchesSearch && matchesUser;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
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
                <span className="text-gray-700">{user.displayName}</span>
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
                {user?.uid === book.userId && (
                  <>
                    <button className="text-yellow-500 hover:text-yellow-600">Edytuj</button>
                    <button className="text-red-500 hover:text-red-600">Usuń</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
import { createContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { auth } from "../firebase";

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      fetchBooks();
    });

    return () => unsubscribe();
  }, []);

  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books: ", error);
      setLoading(false);
    }
  };

  const addBook = async (book) => {
    try {
      const newBook = {
        ...book,
        userId: user?.uid || null,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "books"), newBook);
      fetchBooks(); // Odśwież listę książek
      return docRef.id;
    } catch (error) {
      console.error("Error adding book: ", error);
      throw error;
    }
  };

  return (
    <BooksContext.Provider value={{ books, addBook, user, loading }}>
      {children}
    </BooksContext.Provider>
  );
};
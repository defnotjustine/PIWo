import { createContext, useState } from "react";

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Władca Pierścieni",
      author: "J.R.R. Tolkien",
      category: "Fantasy",
    },
    {
      id: 2,
      title: "Duma i uprzedzenie",
      author: "Jane Austen",
      category: "Klasyka",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      category: "Dystopia",
    },
    {
      id: 4,
      title: "Buszujący w zbożu",
      author: "J.D. Salinger",
      category: "Klasyka",
    },
    {
      id: 5,
      title: "Zabić drozda",
      author: "Harper Lee",
      category: "Klasyka",
    },
    {
      id: 6,
      title: "Harry Potter i Kamień Filozoficzny",
      author: "J.K. Rowling",
      category: "Fantasy",
    },
    {
      id: 7,
      title: "Rok 1984",
      author: "George Orwell",
      category: "Dystopia",
    },
    {
      id: 8,
      title: "Mistrz i Małgorzata",
      author: "M. Bułhakow",
      category: "Fantastyka",
    },
    {
      id: 9,
      title: "Ojciec chrzestny",
      author: "Mario Puzo",
      category: "Thriller",
    },
    {
      id: 10,
      title: "Sto lat samotności",
      author: "Gabriel García Márquez",
      category: "Magiczny realizm",
    },
  ]);

  return (
    <BooksContext.Provider value={{ books, setBooks }}>
      {children}
    </BooksContext.Provider>
  );
};

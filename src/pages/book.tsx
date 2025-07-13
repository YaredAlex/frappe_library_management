import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Book } from "../types";
import { BookModal } from "../components/BookModal";
import { validateBook } from "../utils/validation";
import { NotFound } from "./not_found";
import { ConfirmModal, FRAPPE_API_URL, getCSRFToken } from "../utils/helper";
import Swal from "sweetalert2";
import { useData } from "../context/DataContext";

export const Books = () => {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentBook, setCurrentBook] = useState<
    Book | Omit<Book, "name" | "is_available" | "reserved_by"> | null
  >(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string>("");
  const { books, setBooks } = useData();
  const handleEdit = (book: Book) => {
    setCurrentBook(book);
    setIsModalOpen(true);
    setFormErrors({});
    setMessage("");
  };

  const handleDelete = async (id: string) => {
    if (await ConfirmModal("Do you really want to delete this book?")) {
      const res = await deleteBook(id);
      if (res) {
        setMessage("Book deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handleAddClick = () => {
    setCurrentBook({ title: "", author: "", publish_date: "", isbn: "" });
    setIsModalOpen(true);
    setFormErrors({});
    setMessage("");
  };

  const handleReserve = async (bookId: string) => {
    if (!currentUser) {
      setMessage("Please log in to reserve a book.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (await createReservation(bookId, currentUser.name)) {
      setMessage("Book reserved successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  const addBook = async (
    newBook: Omit<Book, "name" | "is_available" | "reservedBy">
  ) => {
    try {
      const res = await fetch(`${FRAPPE_API_URL}/api/resource/Book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Frappe-CSRF-Token": getCSRFToken(),
        },
        body: JSON.stringify({
          ...newBook,
          publish_date: new Date(newBook.publish_date!)
            .toISOString()
            .slice(0, 10),
          is_available: true,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.exception) {
        const message: string = data.exception.split(":")[1];
        Swal.fire("Error", message, "error");
        return false;
      } else {
        console.log(data.message);
        setBooks((prev) => [
          ...prev,
          {
            ...data.message,
            is_available: true,
            reservedBy: [],
          },
        ]);
        return true;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  };

  const updateBook = async (book: Book) => {
    try {
      const res = await fetch(
        `${FRAPPE_API_URL}/api/resource/Book/${book.name}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...book,
            publish_date: new Date(book.publish_date!)
              .toISOString()
              .slice(0, 10),
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.exception) {
        const message: string = data.exception.split(":")[1];
        Swal.fire("Error", message || "Error occured", "error");
        return false;
      } else {
        setBooks((prev) => prev.map((b) => (b.name === book.name ? book : b)));
        return true;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  };

  const deleteBook = async (id: string) => {
    try {
      const res = await fetch(`${FRAPPE_API_URL}/api/resource/Book/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.exception) {
        const message: string = data.exception.split(":")[1];
        console.log(message);
        Swal.fire("Error", message, "error");
        return false;
      } else {
        setBooks((prev) => prev.filter((book) => book.name !== id));
        // setLoans((prev) => prev.filter((loan) => loan.book !== id));
        return true;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  };
  const createReservation = async (bookId: string, memberId: string) => {
    try {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/method/library_management.api.book.reserve_book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ book_id: bookId, user_id: memberId }),
        }
      );
      const data = await response.json();
      if (data.exception || data.exc_type) {
        const message: string =
          data.exception?.split(":")[1] || "Error occured";
        if (data.exc_type) {
          const messages = JSON.parse(data._server_messages);
          const firstMessage = JSON.parse(messages[0]);
          Swal.fire("Error", firstMessage.message, "error");
        } else Swal.fire("Error", message, "error");
        return false;
      } else {
        await fetchBooks();
        return true;
      }
    } catch (error) {
      console.error("Error reserving book:", error);
    }
    return false;
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/method/library_management.api.book.get_books`,
        { method: "GET", credentials: "include" }
      );
      const data = await response.json();
      console.log(data);
      setBooks(data.message);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (!currentUser) {
    return <NotFound />;
  }
  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Book Catalog</h2>
      {message && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {message}
        </div>
      )}
      {(currentUser.role === "librarian" || currentUser.role === "admin") && (
        <button
          onClick={handleAddClick}
          className="mb-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Add New Book
        </button>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Author</th>
              <th className="py-3 px-6 text-left">Publish Date</th>
              <th className="py-3 px-6 text-left">ISBN</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {books?.map((book) => (
              <tr
                key={book.name}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {book.title}
                </td>
                <td className="py-3 px-6 text-left">{book.author}</td>
                <td className="py-3 px-6 text-left">{book.publish_date}</td>
                <td className="py-3 px-6 text-left">{book.isbn}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      book.is_available
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {book.is_available ? "Available" : "On Loan"}
                  </span>
                  {book.reserved_by && book.reserved_by.length > 0 && (
                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
                      Reserved ({book.reserved_by.length})
                    </span>
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-2">
                    {(currentUser.role === "librarian" ||
                      currentUser.role === "admin") && (
                      <>
                        <button
                          onClick={() => handleEdit(book)}
                          className="w-8 h-8 rounded-full  text-white flex items-center justify-center hover:bg-yellow-500 transition duration-200"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-600 hover:text-blue-600 transition"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(book.name)}
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition duration-200"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </>
                    )}
                    {currentUser.role === "member" && !book.is_available && (
                      <button
                        onClick={() => handleReserve(book.name)}
                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
                        title="Reserve"
                      >
                        Reserve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentBook && (
        <BookModal
          book={currentBook}
          onClose={() => setIsModalOpen(false)}
          onSave={async (bookData) => {
            const errors = validateBook(bookData);
            if (Object.keys(errors).length > 0) {
              setFormErrors(errors);
              return false;
            }
            if ("name" in bookData && bookData.name) {
              const res = await updateBook(bookData as Book);
              if (res) setMessage("Book updated successfully!");
            } else {
              const res = await addBook(
                bookData as Omit<Book, "name" | "is_available" | "reservedBy">
              );
              if (res) setMessage("Book added successfully!");
            }
            setTimeout(() => setMessage(""), 3000);
            setIsModalOpen(false);
            return true;
          }}
          formErrors={formErrors}
        />
      )}
    </div>
  );
};

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Loan } from "../types";
import { validateLoan } from "../utils/validation";
import { ConfirmModal, formatDate, FRAPPE_API_URL } from "../utils/helper";
import { NotFound } from "./not_found";
import { useData } from "../context/DataContext";
import Swal from "sweetalert2";

export const Loans = () => {
  const { books, setBooks, members, loans, setLoans } = useData();
  const { currentUser } = useAuth();
  const [newLoan, setNewLoan] = useState<Omit<Loan, "name" | "returned_date">>({
    book: "",
    member: "",
    loan_date: "",
    return_date: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewLoan({ ...newLoan, [name]: value });
  };

  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateLoan(newLoan);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const selectedBook = books.find((b) => b.name === newLoan.book);
    if (!selectedBook || !selectedBook.is_available) {
      setFormErrors({ bookId: "Selected book is currently unavailable." });
      return;
    }

    const res = await createLoan(newLoan);
    if (res) {
      setMessage("Loan created successfully!");
      setNewLoan({ book: "", member: "", loan_date: "", return_date: "" });
      setFormErrors({});
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleReturnLoan = async (loanId: string) => {
    if (
      await ConfirmModal("Are you sure you want to mark this loan as returned?")
    ) {
      const res = await returnLoan(loanId);
      if (res) {
        setMessage("Book returned successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };
  const cancelReservation = async (bookId: string, memberId: string) => {
    try {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/method/library_management.api.book.cancel_reservation`,
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
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.name === bookId
              ? {
                  ...book,
                  reserved_by: book.reserved_by?.filter(
                    (e) => e.name !== memberId
                  ),
                }
              : book
          )
        );
        return true;
      }
    } catch (error) {
      console.error("Error reserving book:", error);
    }

    return false;
  };
  const handleCancelReservation = async (bookId: string, memberId: string) => {
    if (
      await ConfirmModal("Are you sure you want to cancel this reservation?")
    ) {
      cancelReservation(bookId, memberId);
      setMessage("Reservation cancelled successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getBookTitle = (bookId: string): string =>
    books.find((b) => b.name === bookId)?.title || "Unknown Book";
  const getMemberName = (memberId: string): string =>
    members.find((m) => m.name === memberId)?.name || "Unknown Member";

  const createLoan = async (loanData: Omit<Loan, "name" | "returned_date">) => {
    try {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/method/library_management.api.loan.create_loan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loanData),
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log("loan data", data);
      if (data.exception) {
        const message: string = data.exception.split(":")[1];
        console.log(message);
        Swal.fire("Error", message, "error");
        return false;
      } else {
        setLoans((prev) => [...prev, { ...data.message.loan }]);
        return true;
      }
    } catch (error) {
      console.error("Error creating loan:", error);
    }
    return false;
  };

  const returnLoan = async (loanId: string) => {
    try {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/method/library_management.api.loan.return_book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ loan_name: loanId }),
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log("return data", data);
      if (data.exception) {
        const message: string = data.exception.split(":")[1];
        console.log(message);
        Swal.fire("Error", message, "error");
        return false;
      } else {
        setLoans((prev) =>
          prev.map((loan) =>
            loan.name === loanId
              ? {
                  ...loan,
                  returned: true,
                }
              : loan
          )
        );

        return true;
      }
    } catch (error) {
      console.error("Error returning loan:", error);
    }
    return false;
  };
  const fetchLoans = async () => {
    try {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/method/library_management.api.loan.get_loans`,
        { method: "GET", credentials: "include" }
      );
      const data = await response.json();
      console.log(data);
      setLoans(data.message);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  useEffect(() => {
    fetchLoans();
  }, []);

  if (!currentUser) {
    return <NotFound />;
  }

  const memberLoans =
    currentUser.role === "member"
      ? loans.filter((loan) => loan.member === currentUser.name)
      : [];

  const memberReservations =
    currentUser.role === "member"
      ? books.filter(
          (book) =>
            book.reserved_by &&
            book.reserved_by.find((e) => e.name === currentUser.name)
        )
      : [];

  if (currentUser.role === "member") {
    return (
      <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          My Loans & Reservations
        </h2>
        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {message}
          </div>
        )}

        <h3 className="text-3xl font-semibold text-gray-700 mb-4">
          Current Loans
        </h3>
        {memberLoans.length === 0 ? (
          <p className="text-gray-600">You currently have no books on loan.</p>
        ) : (
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Book Title</th>
                  <th className="py-3 px-6 text-left">Loan Date</th>
                  <th className="py-3 px-6 text-left">Return Date</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {memberLoans.map((loan) => (
                  <tr
                    key={loan.name}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">
                      {getBookTitle(loan.book)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatDate(loan.loan_date)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatDate(loan.loan_date)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          new Date() > new Date(loan.return_date) &&
                          !loan.returned_date
                            ? "bg-red-200 text-red-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {loan.returned_date
                          ? `Returned (${formatDate(loan.returned_date)})`
                          : new Date() > new Date(loan.return_date)
                          ? "Overdue"
                          : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h3 className="text-3xl font-semibold text-gray-700 mb-4">
          My Reservations
        </h3>
        {memberReservations.length === 0 ? (
          <p className="text-gray-600">
            You currently have no book reservations.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Book Title</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {memberReservations.map((book) => (
                  <tr
                    key={book.name}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">{book.title}</td>
                    <td className="py-3 px-6 text-left">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
                        Reserved
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() =>
                          handleCancelReservation(book.name, currentUser.name)
                        }
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        Cancel Reservation
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
  // Librarian/Admin view
  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Manage Loans</h2>
      {message && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleCreateLoan}
        className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8"
      >
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Create New Loan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="bookId"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Book
            </label>
            <select
              id="bookId"
              name="book"
              value={newLoan.book}
              onChange={handleInputChange}
              className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.bookId ? "border-red-500" : ""
              }`}
            >
              <option value="">Select a book</option>
              {books
                .filter((b) => b.is_available)
                .map((book) => (
                  <option key={book.name} value={book.name}>
                    {book.title}
                  </option>
                ))}
            </select>
            {formErrors.bookId && (
              <p className="text-red-500 text-xs italic">{formErrors.bookId}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="memberId"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Member
            </label>
            <select
              id="memberId"
              name="member"
              value={newLoan.member}
              onChange={handleInputChange}
              className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.memberId ? "border-red-500" : ""
              }`}
            >
              <option value="">Select a member</option>
              {members.map((member) => (
                <option key={member.name} value={member.name}>
                  {member.full_name} ({member.name})
                </option>
              ))}
            </select>
            {formErrors.memberId && (
              <p className="text-red-500 text-xs italic">
                {formErrors.memberId}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="loanDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Loan Date
            </label>
            <input
              type="date"
              id="loanDate"
              name="loan_date"
              value={newLoan.loan_date}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.loanDate ? "border-red-500" : ""
              }`}
            />
            {formErrors.loanDate && (
              <p className="text-red-500 text-xs italic">
                {formErrors.loanDate}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="returnDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              name="return_date"
              value={newLoan.return_date}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.returnDate ? "border-red-500" : ""
              }`}
            />
            {formErrors.returnDate && (
              <p className="text-red-500 text-xs italic">
                {formErrors.returnDate}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Issue Book
        </button>
      </form>

      <h3 className="text-3xl font-semibold text-gray-700 mb-4">
        Current Loans
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Book Title</th>
              <th className="py-3 px-6 text-left">Member Name</th>
              <th className="py-3 px-6 text-left">Loan Date</th>
              <th className="py-3 px-6 text-left">Return Date</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {loans
              .filter((loan) => !loan.returned)
              .map((loan) => (
                <tr
                  key={loan.name}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {getBookTitle(loan.book)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {getMemberName(loan.member)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatDate(loan.loan_date)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatDate(loan.return_date)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        new Date() > new Date(loan.return_date)
                          ? "bg-red-200 text-red-800"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {new Date() > new Date(loan.return_date)
                        ? "Overdue"
                        : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleReturnLoan(loan.name)}
                      className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      Return Book
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-3xl font-semibold text-gray-700 mb-4 mt-8">
        Loan History
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Book Title</th>
              <th className="py-3 px-6 text-left">Member Name</th>
              <th className="py-3 px-6 text-left">Loan Date</th>
              <th className="py-3 px-6 text-left">Return Date</th>
              <th className="py-3 px-6 text-left">Returned Date</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {loans
              .filter((loan) => loan.returned)
              .map((loan) => (
                <tr
                  key={loan.name}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {getBookTitle(loan.book)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {getMemberName(loan.member)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatDate(loan.loan_date)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatDate(loan.return_date)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {loan.returned_date
                      ? formatDate(loan.returned_date)
                      : "N/A"}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        loan.returned_date &&
                        new Date(loan.returned_date) >
                          new Date(loan.return_date)
                          ? "bg-orange-200 text-orange-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      Returned{" "}
                      {loan.returned_date &&
                      new Date(loan.returned_date) > new Date(loan.return_date)
                        ? "(Late)"
                        : "(On Time)"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

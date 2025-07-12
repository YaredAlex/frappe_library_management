import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { formatDate } from "../utils/helper";

export const Reports = () => {
  const { books, members, loans } = useData();
  const { currentUser } = useAuth();

  if (
    !currentUser ||
    (currentUser.role !== "librarian" && currentUser.role !== "admin")
  ) {
    return (
      <div className="container mx-auto p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-lg mt-8 text-center">
        <p className="text-lg font-semibold">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const booksOnLoan = loans
    .filter((loan) => !loan.returned_date)
    .map((loan) => ({
      ...loan,
      bookTitle:
        books.find((b) => b.name === loan.book)?.title || "Unknown Book",
      memberName:
        members.find((m) => m.name === loan.member)?.name || "Unknown Member",
    }));

  const overdueBooks = booksOnLoan.filter(
    (loan) => new Date() > new Date(loan.return_date)
  );

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Library Reports</h2>

      <div className="mb-8">
        <h3 className="text-3xl font-semibold text-gray-700 mb-4">
          Books Currently on Loan
        </h3>
        {booksOnLoan.length === 0 ? (
          <p className="text-gray-600">No books are currently on loan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Book Title</th>
                  <th className="py-3 px-6 text-left">Member Name</th>
                  <th className="py-3 px-6 text-left">Loan Date</th>
                  <th className="py-3 px-6 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {booksOnLoan.map((loan) => (
                  <tr
                    key={loan.name}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {loan.bookTitle}
                    </td>
                    <td className="py-3 px-6 text-left">{loan.memberName}</td>
                    <td className="py-3 px-6 text-left">
                      {formatDate(loan.loan_date)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatDate(loan.return_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-3xl font-semibold text-gray-700 mb-4">
          Overdue Books
        </h3>
        {overdueBooks.length === 0 ? (
          <p className="text-gray-600">No books are currently overdue.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Book Title</th>
                  <th className="py-3 px-6 text-left">Member Name</th>
                  <th className="py-3 px-6 text-left">Loan Date</th>
                  <th className="py-3 px-6 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {overdueBooks.map((loan) => (
                  <tr
                    key={loan.name}
                    className="border-b border-gray-200 hover:bg-gray-100 bg-red-50"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {loan.bookTitle}
                    </td>
                    <td className="py-3 px-6 text-left">{loan.memberName}</td>
                    <td className="py-3 px-6 text-left">
                      {formatDate(loan.loan_date)}
                    </td>
                    <td className="py-3 px-6 text-left text-red-700 font-semibold">
                      {formatDate(loan.return_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

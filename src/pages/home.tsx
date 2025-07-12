import React from "react";

export const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-xl mt-8">
    <h2 className="text-5xl font-extrabold text-gray-800 mb-6 animate-fade-in-down">
      Welcome to Library Hub!
    </h2>
    <p className="text-xl text-gray-600 text-center max-w-2xl leading-relaxed animate-fade-in-up">
      Your comprehensive solution for managing books, members, and loans with
      ease. Librarians can efficiently manage the catalog, track borrowing, and
      generate reports. Members can browse available books and reserve their
      next read.
    </p>
    <div className="mt-10 flex space-x-6">
      <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-blue-200">
        <h3 className="text-2xl font-bold text-blue-700 mb-3">
          Librarian Tools
        </h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Manage Book Catalog</li>
          <li>Update Member Records</li>
          <li>Track Loans & Returns</li>
          <li>Generate Reports</li>
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-indigo-200">
        <h3 className="text-2xl font-bold text-indigo-700 mb-3">
          Member Features
        </h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Browse Available Books</li>
          <li>View Loan History</li>
          <li>Reserve Unavailable Books</li>
          <li>Receive Overdue Notifications</li>
        </ul>
      </div>
    </div>
  </div>
);

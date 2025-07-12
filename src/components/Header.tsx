import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FRAPPE_API_URL } from "../utils/helper";

export const Header = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const logout = async () => {
    try {
      await fetch(`${FRAPPE_API_URL}/api/method/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during Frappe logout:", error);
    } finally {
      setCurrentUser(null);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          Library Hub
        </h1>
        <nav className="space-x-4 flex flex-wrap items-center">
          {currentUser && (
            <>
              {(currentUser.role === "librarian" ||
                currentUser.role === "admin") && (
                <>
                  <NavLink to="/books">Books</NavLink>
                  <NavLink to="/members">Members</NavLink>
                  <NavLink to="/loans">Loans</NavLink>
                  <NavLink to="/reports">Reports</NavLink>
                </>
              )}
              {currentUser.role === "member" && (
                <>
                  <NavLink to="/books">Browse Books</NavLink>
                  <NavLink to="/loans">My Loans</NavLink>
                </>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Logout ({currentUser.username})
              </button>
            </>
          )}
          {!currentUser && (
            <>
              <NavLink to="/auth">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 ${
        isActive
          ? "bg-white text-blue-700 shadow-md"
          : "text-white hover:bg-blue-500 hover:bg-opacity-30"
      }`}
    >
      {children}
    </Link>
  );
};

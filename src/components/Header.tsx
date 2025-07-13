import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FRAPPE_API_URL } from "../utils/helper";

export const Header = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const navigate = useNavigate();
  const logout = async () => {
    try {
      await fetch(`${FRAPPE_API_URL}/api/method/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.clear();
      sessionStorage.clear();

      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie =
          name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });

      navigate("/auth");
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
    <header className="">
      <div className="container mx-auto flex flex-col justify-between items-center">
        <h2 className="text-2xl font-bold  tracking-wide">
          Library Management
        </h2>
        <nav className="space-x-4 flex flex-col gap-2 justify-start mt-10">
          {currentUser && (
            <>
              {(currentUser.role === "librarian" ||
                currentUser.role === "admin") && (
                <>
                  <NavLink to="/books">Books</NavLink>
                  <NavLink to="/members">Members</NavLink>
                  <NavLink to="/loans">Loans</NavLink>
                  <NavLink to="/reports">Reports</NavLink>
                  <NavLink to="/register">Register</NavLink>
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
              <div className="mt-auto" style={{ marginTop: "auto" }}>
                <NavLink to="/auth">Login</NavLink>
              </div>
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
      className={`block px-4 py-2 rounded-lg font-medium transition duration-200 ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-white hover:bg-gray-700"
      }`}
    >
      {children}
    </Link>
  );
};

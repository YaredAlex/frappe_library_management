import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import type { Book, Loan, Member, User } from "./types";
import { Auth } from "./pages/auth";
import { Books } from "./pages/book";
import { Members } from "./pages/members";
import { NotFound } from "./pages/not_found";
import { Loans } from "./pages/loans";
import { Reports } from "./pages/reports";
import { Register } from "./pages/register";
import { Header } from "./components/Header";
import { AuthContext } from "./context/AuthContext";
import { DataContext } from "./context/DataContext";
import { Footer } from "./components/Footer";
import "./App.css";
import { FRAPPE_API_URL } from "./utils/helper";
import { LoadingScreen } from "./components/Loading";

const AppRoutes = ({ currentUser }: { currentUser: User | null }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={currentUser ? "/books" : "/auth"} />}
      />
      <Route path="/auth" element={<Auth />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/books"
        element={currentUser ? <Books /> : <Navigate to="/auth" />}
      />
      <Route
        path="/loans"
        element={currentUser ? <Loans /> : <Navigate to="/auth" />}
      />
      <Route
        path="/members"
        element={
          currentUser &&
          (currentUser.role === "admin" ||
            currentUser.role === "System User" ||
            currentUser.role === "librarian") ? (
            <Members />
          ) : (
            <NotFound />
          )
        }
      />
      <Route
        path="/reports"
        element={
          currentUser &&
          (currentUser.role === "admin" ||
            currentUser.role === "System User" ||
            currentUser.role === "librarian") ? (
            <Reports />
          ) : (
            <NotFound />
          )
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true); // Initially true to show loader

  useEffect(() => {
    const getDetail = async (email: string) => {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/resource/User/${email}`,
        { method: "GET", credentials: "include" }
      );
      return await response.json();
    };

    const checkSession = async () => {
      try {
        const res = await fetch(
          `${FRAPPE_API_URL}/api/method/frappe.auth.get_logged_user`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (data.message && data.message !== "Guest") {
          const detail = await getDetail(data.message);
          const role: User["role"] =
            detail.data["user_type"] === "System User"
              ? "admin"
              : detail["user_type"] ?? "member";
          setCurrentUser({
            name: data.message,
            username: detail.data.full_name,
            role,
          });
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setLoading(false); // Always hide loader after session check
      }
    };

    checkSession();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans antialiased flex flex-col">
        <AuthContext.Provider
          value={{ currentUser, setCurrentUser, loading, setLoading }}
        >
          <DataContext.Provider
            value={{
              books,
              setBooks,
              members,
              setMembers,
              loans,
              setLoans,
            }}
          >
            {loading ? (
              <LoadingScreen />
            ) : (
              <>
                <Header />
                <main className="flex-grow container mx-auto p-4">
                  <AppRoutes currentUser={currentUser} />
                </main>
                <Footer />
              </>
            )}
          </DataContext.Provider>
        </AuthContext.Provider>
      </div>
    </Router>
  );
};

export default App;

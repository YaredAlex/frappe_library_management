import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types";
import { checkSession, FRAPPE_API_URL } from "../utils/helper";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const { setCurrentUser } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const getDetail = async (email: string) => {
    const response = await fetch(
      `${FRAPPE_API_URL}/api/method/library_management.api.user.user_details?email=${email}`,
      { method: "GET", credentials: "include" }
    );
    return await response.json();
  };

  useEffect(() => {
    const check = async () => {
      console.log("checking session");
      const user = await checkSession();
      if (user) {
        console.log(user);
        setCurrentUser(user);
      }
    };
    check();
  }, []);
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const formData = new URLSearchParams();
      formData.append("usr", username);
      formData.append("pwd", password);

      const response = await fetch(`${FRAPPE_API_URL}/api/method/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        credentials: "include",
      });

      if (response.ok) {
        const detail = await getDetail(username);
        console.log(detail);
        let role: User["role"] = "member";
        if (
          detail.message["roles"].find((e: string) => e === "Administrator")
        ) {
          role = "admin";
        } else if (
          detail.message["roles"].find((e: string) => e === "Librarian")
        )
          role = "librarian";
        setCurrentUser({
          name: username,
          username: detail.message.username,
          role: role.toLocaleLowerCase() as User["role"],
        });

        return true;
      } else {
        const errorData = await response.json();
        console.error("Frappe login failed:", errorData);
        setMessage(errorData.message);
        setTimeout(() => setMessage(""), 3000);
        return false;
      }
    } catch (error) {
      console.error("Error during Frappe login:", error);
      return false;
    }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const success = await login(username, password);
    setIsLoading(false);

    if (success) {
      navigate("/books");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-180px)] p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-blue-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login to Library
        </h2>
        {message && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {message}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          <span className="font-semibold">
            Demo Accounts (for local simulation):
          </span>
          Admin: administrator/admin@123 (role: admin)
        </p>
      </div>
    </div>
  );
};

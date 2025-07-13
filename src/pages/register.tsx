import { useState } from "react";
import { Link } from "react-router-dom";
import { FRAPPE_API_URL } from "../utils/helper";

export const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateRegistration = () => {
    const errors: { [key: string]: string } = {};
    if (!role) errors.role = "User type is required.";
    if (!firstName.trim()) errors.firstName = "First Name is required.";
    if (!lastName.trim()) errors.lastName = "Last Name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid.";
    if (!phone.trim()) errors.phone = "Phone is required.";
    if (!password) errors.password = "Password is required.";
    if (password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    // if (password !== confirmPassword)
    //   errors.confirmPassword = "Passwords do not match.";
    return errors;
  };
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    // setConfirmPassword(""); // Uncomment if used
    setRole("Member");
    setMessage("");
    setFormErrors({});
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegistration();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setMessage("Please correct the errors in the form.");
      return;
    }

    setMessage("");
    setFormErrors({});
    setIsLoading(true);

    try {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/method/library_management.api.user.create_user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            role,
            password,
          }),
          credentials: "include",
        }
      );

      const resData = await response.json();
      if (response.ok && resData.message) {
        setMessage("Registration successful!");
        resetForm();
      } else {
        console.log(resData);
        const message = resData.exception
          ? resData.exception.split(":")[1]
          : resData.message;
        setMessage(`Registration failed: ${message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-180px)] p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Register as a New User
        </h2>

        {/* User Type Selection */}
        <div className="flex justify-center gap-4 mb-6">
          {["Admin", "Librarian", "Member"].map((r) => (
            <label
              key={r}
              className={`cursor-pointer px-4 py-2 rounded-lg border text-sm font-semibold transition ${
                role === r
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="userType"
                value={r}
                className="hidden"
                checked={role === r}
                onChange={() => setRole(r)}
              />
              {r}
            </label>
          ))}
        </div>

        {message && (
          <div
            className={`px-4 py-3 rounded relative mb-4 ${
              message.includes("successful")
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  formErrors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-xs">{formErrors.firstName}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  formErrors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-xs">{formErrors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                formErrors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-xs">{formErrors.phone}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs">{formErrors.password}</p>
            )}
          </div>
          {/* 
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                formErrors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {formErrors.confirmPassword}
              </p>
            )}
          </div> */}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold w-full py-2 rounded transition"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/auth" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

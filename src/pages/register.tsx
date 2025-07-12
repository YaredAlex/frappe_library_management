import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [membershipId, setMembershipId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateRegistration = () => {
    const errors: { [key: string]: string } = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!membershipId.trim())
      errors.membershipId = "Membership ID is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid.";
    if (!phone.trim()) errors.phone = "Phone is required.";
    if (!password) errors.password = "Password is required.";
    if (password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    return errors;
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
        "http://localhost:8000/api/method/frappe.website.doctype.user.user.sign_up",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            full_name: name,
            password: password,
          }),
        }
      );

      if (response.ok) {
        setMessage("Registration successful! Redirecting to login...");
        setName("");
        setMembershipId("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/auth"), 3000);
      } else {
        const errorData = await response.json();
        setMessage(
          `Registration failed: ${errorData.message || "Unknown error"}`
        );
        console.error("Frappe registration failed:", errorData);
      }
    } catch (error) {
      setMessage("An error occurred during registration. Please try again.");
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-180px)] p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg border border-blue-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Register as a New Member
        </h2>
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
            {/* Full Name */}
            <div className="mb-4">
              <label
                htmlFor="regName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="regName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formErrors.name ? "border-red-500" : ""
                }`}
                placeholder="Your Full Name"
                required
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs italic">{formErrors.name}</p>
              )}
            </div>

            {/* Membership ID */}
            <div className="mb-4">
              <label
                htmlFor="regMembershipId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Membership ID
              </label>
              <input
                type="text"
                id="regMembershipId"
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formErrors.membershipId ? "border-red-500" : ""
                }`}
                placeholder="Unique ID"
                required
              />
              {formErrors.membershipId && (
                <p className="text-red-500 text-xs italic">
                  {formErrors.membershipId}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="regEmail"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="regEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.email ? "border-red-500" : ""
              }`}
              placeholder="your@example.com"
              required
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs italic">{formErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              htmlFor="regPhone"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Phone
            </label>
            <input
              type="text"
              id="regPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.phone ? "border-red-500" : ""
              }`}
              placeholder="e.g., 555-123-4567"
              required
            />
            {formErrors.phone && (
              <p className="text-red-500 text-xs italic">{formErrors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="regPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="regPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.password ? "border-red-500" : ""
              }`}
              placeholder="Password"
              required
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs italic">
                {formErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              htmlFor="regConfirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="regConfirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.confirmPassword ? "border-red-500" : ""
              }`}
              placeholder="Confirm Password"
              required
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs italic">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{" "}
            <Link
              to="/auth"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

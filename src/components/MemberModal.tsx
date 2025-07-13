import { useState } from "react";
import type { Member } from "../types";

interface MemberModalProps {
  member: Member | Omit<Member, "name">;
  onClose: () => void;
  onSave: (memberData: Member | Omit<Member, "name">) => Promise<boolean>;
  formErrors: { [key: string]: string };
}

export const MemberModal = ({
  member,
  onClose,
  onSave,
  formErrors,
}: MemberModalProps) => {
  const [formData, setFormData] = useState<Member | Omit<Member, "name">>(
    member
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-white/80 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          {"name" in member && member.name ? "Edit Member" : "Add New Member"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.first_name ? "border-red-500" : ""
              }`}
            />
            {formErrors.first_name && (
              <p className="text-red-500 text-xs italic">
                {formErrors.first_name}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.last_name ? "border-red-500" : ""
              }`}
            />
            {formErrors.last_name && (
              <p className="text-red-500 text-xs italic">
                {formErrors.last_name}
              </p>
            )}
          </div>
          {/* <div className="mb-4">
            <label
              htmlFor="membershipId"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Membership ID
            </label>
            <input
              type="text"
              id="membershipId"
              name="membership_id"
              value={formData.membership_id}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.membershipId ? "border-red-500" : ""
              }`}
            />
            {formErrors.membershipId && (
              <p className="text-red-500 text-xs italic">
                {formErrors.membershipId}
              </p>
            )}
          </div> */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.email ? "border-red-500" : ""
              }`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs italic">{formErrors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.phone ? "border-red-500" : ""
              }`}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-xs italic">{formErrors.phone}</p>
            )}
          </div>
          {!("name" in member) && (
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formErrors.password ? "border-red-500" : ""
                }`}
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs italic">
                  {formErrors.password}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

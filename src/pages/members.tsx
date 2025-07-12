import { useEffect, useState } from "react";
import type { Member } from "../types";
import { useAuth } from "../context/AuthContext";
import { MemberModal } from "../components/MemberModal";
import { validateMember } from "../utils/validation";
import { FRAPPE_API_URL } from "../utils/helper";
import Swal from "sweetalert2";
import { useData } from "../context/DataContext";

export const Members = () => {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentMember, setCurrentMember] = useState<
    Member | Omit<Member, "name"> | null
  >(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string>("");
  const { members, setMembers } = useData();
  const handleEdit = (member: Member) => {
    setCurrentMember(member);
    setIsModalOpen(true);
    setFormErrors({});
    setMessage("");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      const res = await deleteMember(id);
      if (res) {
        setMessage("Member deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const handleAddClick = () => {
    setCurrentMember({
      full_name: "",
      membership_id: "",
      email: "",
      phone: "",
    });
    setIsModalOpen(true);
    setFormErrors({});
    setMessage("");
  };
  const addMember = async (newMember: Omit<Member, "name">) => {
    try {
      const response = await fetch(`${FRAPPE_API_URL}/api/resource/Member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (data.exception) {
        const message: string = data.exception.split(":")[1];
        console.log(message);
        Swal.fire("Error", message, "error");
        return false;
      } else {
        setMembers((prev) => [...prev, data.data]);
        return true;
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
    return false;
  };

  const updateMember = async (updatedMember: Member) => {
    try {
      const member = { ...updatedMember };
      const response = await fetch(
        `${FRAPPE_API_URL}/api/resource/Member/${updatedMember.name}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(member),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.exception) {
        const message: string = data.exception.split(":")[1];
        console.log(message);
        Swal.fire("Error", message, "error");
        return false;
      } else {
        setMembers((prev) =>
          prev.map((member) =>
            member.name === updatedMember.name ? data.data : member
          )
        );
        return true;
      }
    } catch (error) {
      console.error("Error updating member:", error);
    }
    return false;
  };

  const deleteMember = async (id: string) => {
    try {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/resource/Member/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.exception) {
        const message: string = data.exception.split(":")[1];
        console.log(message);
        Swal.fire("Error", message, "error");
        return false;
      } else {
        setMembers((prev) => prev.filter((member) => member.name !== id));

        return true;
      }
    } catch (error) {
      console.error("Error deleting memeber:", error);
    }
    return false;
  };
  const fetchMembers = async () => {
    try {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/method/library_management.api.member.get_members`,
        { method: "GET", credentials: "include" }
      );
      const data = await response.json();
      setMembers(data.message);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  useEffect(() => {
    fetchMembers();
  }, []);

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

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Library Members</h2>
      {message && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {message}
        </div>
      )}
      <button
        onClick={handleAddClick}
        className="mb-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Add New Member
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Membership ID</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {members.map((member) => (
              <tr
                key={member.name}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {member.full_name}
                </td>
                <td className="py-3 px-6 text-left">{member.membership_id}</td>
                <td className="py-3 px-6 text-left">{member.email}</td>
                <td className="py-3 px-6 text-left">{member.phone}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center hover:bg-yellow-500 transition duration-200"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-9.192 7.071a1 1 0 000 1.414L9.172 17l5.071-5.071-4.243-4.243-5.657 5.657z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(member.name)}
                      className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition duration-200"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentMember && (
        <MemberModal
          member={currentMember}
          onClose={() => setIsModalOpen(false)}
          onSave={async (memberData) => {
            const errors = validateMember(memberData);
            if (Object.keys(errors).length > 0) {
              setFormErrors(errors);
              return false;
            }
            if ("name" in memberData && memberData.name) {
              const res = await updateMember(memberData as Member);
              if (res) setMessage("Member updated successfully!");
            } else {
              const res = await addMember(memberData as Omit<Member, "id">);
              if (res) setMessage("Member added successfully!");
            }
            setTimeout(() => setMessage(""), 3000);
            setIsModalOpen(false);
            return true;
          }}
          formErrors={formErrors}
        />
      )}
    </div>
  );
};

import type { User } from "../types";

export   const FRAPPE_API_URL = "http://localhost:8000";
export const generateUniqueId = (): string => Math.random().toString(36).substr(2, 9);
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
//Get session 

export const getDetail = async (id: string) => {
      const response = await fetch(
        `${FRAPPE_API_URL}/api/resource/User/${id}`,
        { method: "GET", credentials: "include" }
      );
      return await response.json();
    };
export const checkSession = async () => {
      try {
        const res = await fetch(
          `${FRAPPE_API_URL}/api/method/frappe.auth.get_logged_user`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.message && data.message !== "Guest") {
          const detail = await getDetail(data.message);
          console.log("details are ",detail);
          const role: User["role"] =
            detail.data["user_type"] === "System User"
              ? "admin"
              : detail["user_type"] ?? "member";
          return { name: data.message, role,username:detail.data.full_name }
        }
      } catch (error) {
        console.error("Session check failed:", error);
        return false
      }
    }

export function getCSRFToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}
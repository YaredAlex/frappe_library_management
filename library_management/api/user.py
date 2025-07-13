import frappe
from frappe import _

@frappe.whitelist()
def create_user(email, first_name, last_name, role, password,phone):
    """
    Creates a new user with the specified role and securely sets the password.
    """
    if frappe.db.exists("User", email):
        frappe.throw("User already exists")

    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "enabled": 1,
        "phone":phone,
        "new_password": password,
        "send_welcome_email": 0,
        "roles": [{"role": role}]
    })
    user.insert(ignore_permissions=True)

    return user

@frappe.whitelist()   
def user_details(email):
    if not frappe.db.exists("User", email):
        frappe.throw("User not found")

    user = frappe.get_doc("User", email)
    return {
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username":user.username,
        "roles": [r.role for r in user.roles]
    }
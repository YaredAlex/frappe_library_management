import frappe
from frappe import _

@frappe.whitelist()
def create_user(email, first_name, last_name, role, password):
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
        "new_password": password,
        "send_welcome_email": 0,
        "roles": [{"role": role}]
    })
    user.insert(ignore_permissions=True)

    return email
    

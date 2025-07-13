import frappe
from frappe import _

@frappe.whitelist()
def get_members():
    return frappe.get_all("Member", fields=["name", "full_name", "email", "phone","membership_id"])

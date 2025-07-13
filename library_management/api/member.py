import frappe
from frappe import _

@frappe.whitelist()
def get_members():
    users = frappe.db.sql("""
        SELECT
            u.name,
            u.first_name,
            u.last_name,
            u.email,
            u.phone
        FROM
            `tabUser` u
        INNER JOIN
            `tabHas Role` r ON u.name = r.parent
        WHERE
            r.role = 'Member' AND u.enabled = 1 AND u.user_type = 'Website User'
    """, as_dict=True)

    return users


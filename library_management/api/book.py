import frappe
from frappe import _

@frappe.whitelist()
def get_books():
    return frappe.get_all("Book", fields=["name", "title", "author", "is_available","isbn","publish_date"])

@frappe.whitelist()
def create_book(title, author, publish_date, isbn):
    doc = frappe.new_doc("Book")
    doc.update(locals())
    doc.insert()
    return doc

@frappe.whitelist()
def update_book(book_id, **kwargs):
    doc = frappe.get_doc("Book", book_id)
    doc.update(kwargs)
    doc.save()
    return doc

@frappe.whitelist()
def delete_book(book_id):
    frappe.delete_doc("Book", book_id)
    return {"status": "deleted"}

import frappe
from frappe import _

@frappe.whitelist()
def get_books():
    books = frappe.get_all("Book", fields=["name"])
    return [frappe.get_doc("Book", b.name).as_dict() for b in books]

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


@frappe.whitelist()
def reserve_book(book_id: str, user_id: str):
    if not frappe.db.exists("Book", book_id):
        frappe.throw("Book not found.")

    if not frappe.db.exists("User", user_id):
        frappe.throw("User not found.")

    book = frappe.get_doc("Book", book_id)

    if any(entry.reserved_by == user_id for entry in book.reserved_by):
        frappe.throw("You have already reserved this book.")

    book.append("reserved_by", {
        "reserved_by": user_id
    })

    book.save(ignore_permissions=True)

    return {"message": f"{user_id} has successfully reserved the book."}

@frappe.whitelist()
def cancel_reservation(book_id: str, user_id: str):
    if not frappe.db.exists("Book", book_id):
        frappe.throw("Book not found.")

    if not frappe.db.exists("User", user_id):
        frappe.throw("User not found.")

    book = frappe.get_doc("Book", book_id)
    found = False
    new_reserved_by = []

    for entry in book.reserved_by:
        if entry.reserved_by == user_id:
            found = True
            continue 
        new_reserved_by.append(entry)

    if not found:
        frappe.throw("You do not have a reservation for this book.")
    book.set("reserved_by", new_reserved_by)
    book.save(ignore_permissions=True)

    return {"message": f"{user_id}'s reservation has been canceled."}

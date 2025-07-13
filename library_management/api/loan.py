import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import nowdate
@frappe.whitelist()
def get_loans():
    return frappe.get_all("Loan", fields=["name","book", "member", "loan_date", "return_date","returned","returned_date"])

@frappe.whitelist()
def create_loan(book, member, return_date,loan_date=None,):
    if not loan_date:
        loan_date = nowdate()

    book_doc = frappe.get_doc("Book", book)
    if not book_doc.is_available:
        frappe.throw(_("Book is not available"))

    loan = frappe.get_doc({
        "doctype": "Loan",
        "book": book,
        "member": member,
        "loan_date": loan_date,
        "returned": 0,
        "return_date":return_date,
    })
    loan.insert()
    ##
    book_doc.is_available = 0
    book_doc.save()

    return {"status": "success", "message": _("Loan created successfully."), "loan": loan}

@frappe.whitelist()
def return_book(loan_name):
    loan = frappe.get_doc("Loan", loan_name)
    if loan.returned:
        frappe.throw(_("This book has already been returned."))

    loan.returned = 1
    loan.returned_date = nowdate()
    loan.save()
    book_doc = frappe.get_doc("Book", loan.book)
    book_doc.is_available = 1
    book_doc.save()

    return {"status": "success", "message": _("Book returned successfully."),"loan":loan}

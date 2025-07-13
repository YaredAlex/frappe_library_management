# 📚 Library Management System

A full-stack **Library Management System** built with:

- **Frappe** (Python) as the backend (custom DocTypes, REST API, and role-based permissions)
- **React** (TypeScript) as the frontend (custom standalone UI)

> The backend code is available in the `dev` branch, and the frontend (React UI) is available in the `ui` branch.

---

## Features Overview

- **Book Management** – Librarians can create, view, edit, and delete books (title, author, ISBN, publish date).
- **Member Management** – Librarians can manage members with full_name, membership ID, email, and phone.
- **Loan Creation** – Books can be loaned to members with proper tracking of loan and return dates.
- **Availability Check** – Prevents duplicate loans by ensuring a book is available before lending.
- **Reservation Queue** – Members can reserve books that are currently on loan; the system manages a queue.
- **Overdue Notifications** – Automatically emails members when their book loans become overdue.
- **Reports** – Generate reports of all books currently on loan and all overdue books.
- **REST API** – A secure set of REST API endpoints supports external integration and full CRUD operations.
- **Authentication and Roles** – Users can log in with specific roles: admin, librarian, or member.
- **Custom Frontend UI** – Built entirely in React, the frontend is independent of Frappe Desk and provides a modern user interface.


### Library Management

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch dev
bench install-app library_management
```

### UI Installation
```bash
git clone git@github.com:YaredAlex/frappe_library_management.git
git checkout ui
cd frontend

# Dependancy Installation

npm install
npm run dev
```

### License
mit

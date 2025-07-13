# Library Management UI

A React + TypeScript + Vite web application for managing books, members, and loans in a library. Features include authentication, role-based access, CRUD operations, reservations, and reporting.

## Setup

1. **Clone the repository**

   ```sh
   git clone <repo-url>
   cd lib-ui
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Environment**
   - The app expects a backend running at `http://localhost:8000` (see [`FRAPPE_API_URL`](src/utils/helper.ts)).
   - Ensure the backend API endpoints are available and CORS is configured.

## Run

- **Development server**

  ```sh
  npm run dev
  ```

  - Opens at `http://localhost:5173` by default.

- **Build for production**

  ```sh
  npm run build
  ```

- **Preview production build**
  ```sh
  npm run preview
  ```

## Architectural Decisions

- **React + TypeScript + Vite**: Chosen for fast development, HMR, and type safety.
- **Context API**: Used for global state management ([`AuthContext`](src/context/AuthContext.ts), [`DataContext`](src/context/DataContext.ts)).
- **Role-based Routing**: Routes are protected and rendered based on user roles ([`App.tsx`](src/App.tsx)).
- **Tailwind CSS**: For rapid UI styling ([`App.css`](src/App.css)).
- **API Integration**: All data operations use RESTful endpoints from a Frappe backend.
- **Modular Structure**: Pages, components, context, and utilities are separated for maintainability.

## Shortcuts & Trade-offs

- **No Internationalization**: All text is in English.
- **No Pagination**: Lists (books, members, loans) are loaded fully; may not scale for large datasets.

---

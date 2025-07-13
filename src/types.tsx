export interface Book {
  name: string;
  title: string;
  author: string;
  publish_date?: string;
  isbn?: string;
  is_available: boolean;
  reserved_by?: Member[];
}

export interface Member {
  full_name: string;
  name: string;
  membership_id?: string;
  email: string;
  phone: string;
  first_name?: string;
  last_name?: string;
  password?: string;
}

export interface Loan {
  name: string;
  book: string;
  member: string;
  loan_date: string;
  return_date: string;
  returned_date: string | null;
  returned?: boolean;
}

export interface User {
  name: string;
  username?: string;
  role: "admin" | "librarian" | "member" | "System User";
}

export interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login?: (username: string, password: string) => Promise<boolean>;
  logout?: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DataContextType {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  loans: Loan[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
}

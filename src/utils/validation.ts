import type { Book, Loan, Member } from "../types";

export const validateBook = (book: Omit<Book, 'name' | 'is_available' | 'reservedBy'>): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  if (!book.title.trim()) errors.title = 'Title is required.';
  if (!book.author.trim()) errors.author = 'Author is required.';
  if (!book.publish_date?.trim()) errors.publishDate = 'Publish Date is required.';
  if (!book.isbn?.trim()) errors.isbn = 'ISBN is required.';
  return errors;
};

export const validateMember = (member:Partial<Omit<Member, 'name'>> & { name?: string }): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  if (!member.first_name?.trim()) {
    errors.first_name = 'First name is required.';
  }

  if (!member.last_name?.trim()) {
    errors.last_name = 'Last name is required.';
  }

  if (!member.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(member.email)) {
    errors.email = 'Email is invalid.';
  }

  if (!member.phone?.trim()) {
    errors.phone = 'Phone is required.';
  }

  if (!member.name && !member.password?.trim()) {
    errors.password = 'Password is required.';
  }
  else if(!member.name && member.password!.trim().length < 6){
     errors.password = 'Minimun password is length should be 6.';
  }
  return errors;
};

export const validateLoan = (loan: Omit<Loan, 'name' | 'returned_date'>): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  if (!loan.book) errors.bookId = 'Book is required.';
  if (!loan.member) errors.memberId = 'Member is required.';
  if (!loan.loan_date) errors.loanDate = 'Loan Date is required.';
  if (!loan.return_date) errors.returnDate = 'Return Date is required.';
  if (new Date(loan.loan_date) > new Date(loan.return_date)) {
    errors.returnDate = 'Return Date cannot be before Loan Date.';
  }
  return errors;
};
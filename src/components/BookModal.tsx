import { useState } from "react";
import type { Book } from "../types";

interface BookModalProps {
  book: Book | Omit<Book, "name" | "is_available" | "reservedBy">;
  onClose: () => void;
  onSave: (
    bookData: Book | Omit<Book, "name" | "is_available" | "reservedBy">
  ) => Promise<boolean>;
  formErrors: { [key: string]: string };
}

export const BookModal = ({
  book,
  onClose,
  onSave,
  formErrors,
}: BookModalProps) => {
  const [formData, setFormData] = useState<
    Book | Omit<Book, "name" | "is_available" | "reservedBy">
  >(book);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-white/80 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          {"name" in book && book.name ? "Edit Book" : "Add New Book"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.title ? "border-red-500" : ""
              }`}
            />
            {formErrors.title && (
              <p className="text-red-500 text-xs italic">{formErrors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="author"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.author ? "border-red-500" : ""
              }`}
            />
            {formErrors.author && (
              <p className="text-red-500 text-xs italic">{formErrors.author}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="publishDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Publish Date
            </label>
            <input
              type="date"
              id="publishDate"
              name="publish_date"
              value={formData.publish_date}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.publishDate ? "border-red-500" : ""
              }`}
            />
            {formErrors.publishDate && (
              <p className="text-red-500 text-xs italic">
                {formErrors.publishDate}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="isbn"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.isbn ? "border-red-500" : ""
              }`}
            />
            {formErrors.isbn && (
              <p className="text-red-500 text-xs italic">{formErrors.isbn}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

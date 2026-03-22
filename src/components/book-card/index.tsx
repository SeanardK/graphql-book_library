import { genreBadge } from "@/pages";
import { Book } from "@/pages/api/books";
import React from "react";

interface BookCardProps {
  book: Book;
  handleEditBook: (book: Book) => void;
  handleDeleteBook: (id: number) => void;
  deletingId: number | null;
}

function BookCard({
  book,
  handleEditBook,
  handleDeleteBook,
  deletingId,
}: BookCardProps) {
  return (
    <div
      key={book.id}
      className="card bg-base-100 shadow-xl border-t-4 border-primary hover:shadow-2xl transition-shadow duration-200"
    >
      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <h2 className="card-title text-base leading-snug">{book.title}</h2>
          <span
            className={`badge badge-sm shrink-0 mt-1 ${genreBadge(book.genre)}`}
          >
            {book.genre}
          </span>
        </div>
        <p className="text-sm text-base-content/60">by {book.author}</p>
        <div className="divider my-1" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-base-content/60">
            <span className="font-semibold text-base-content">Published:</span>{" "}
            {book.publishedYear}
          </span>
          <span className="text-xl font-extrabold text-accent">
            ${book.price.toFixed(2)}
          </span>
        </div>
        <div className="card-actions justify-end mt-2">
          <button
            onClick={() => handleEditBook(book)}
            className="btn btn-sm btn-warning gap-1"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteBook(book.id)}
            className="btn btn-sm btn-error gap-1"
            disabled={deletingId === book.id}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;

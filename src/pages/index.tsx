import { gql, useQuery, useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import client from "@/lib/graphql";
import { Book } from "./api/books";
import BookCard from "@/components/book-card";
import Pagination from "@/components/pagination";
import Modal from "@/components/modal";

// GraphQL Queries & Mutations
const GET_BOOKS = gql`
  query Books($limit: Int, $offset: Int) {
    books(limit: $limit, offset: $offset) {
      id
      title
      author
      publishedYear
      genre
      price
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $price: Float!
    $genre: String!
    $publishedYear: Int!
  ) {
    addBook(
      title: $title
      author: $author
      price: $price
      genre: $genre
      publishedYear: $publishedYear
    ) {
      id
      title
      author
      genre
      price
      publishedYear
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $id: Float!
    $title: String
    $author: String
    $price: Float
    $genre: String
    $publishedYear: Int
  ) {
    updateBook(
      id: $id
      title: $title
      author: $author
      price: $price
      genre: $genre
      publishedYear: $publishedYear
    ) {
      id
      title
      author
      genre
      price
      publishedYear
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: Float!) {
    deleteBook(id: $id)
  }
`;

const PAGE_SIZE = 12;

const GENRE_BADGE: Record<string, string> = {
  Fiction: "badge-primary",
  "Non-Fiction": "badge-secondary",
  Fantasy: "badge-accent",
  "Science Fiction": "badge-info",
  Dystopian: "badge-warning",
  Mystery: "badge-error",
  Thriller: "badge-error",
  Romance: "badge-success",
  Horror: "badge-neutral",
};

export function genreBadge(genre: string) {
  return GENRE_BADGE[genre] ?? "badge-outline";
}

export default function Books() {
  const createModalRef = useRef<HTMLDialogElement>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_BOOKS, {
    client,
    variables: { limit: 100, offset: 0 },
  });
  const [addBook] = useMutation(ADD_BOOK, { client });
  const [updateBook] = useMutation(UPDATE_BOOK, { client });
  const [deleteBook] = useMutation(DELETE_BOOK, { client });

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
    publishedYear: "",
  });
  const [editBook, setEditBook] = useState<Book | null>(null);

  const allBooks: Book[] = data?.books ?? [];
  const genres = [...new Set(allBooks.map((b: Book) => b.genre))].sort();
  const query = searchQuery.trim().toLowerCase();
  const visibleBooks = allBooks.filter((b: Book) => {
    const matchesGenre = selectedGenre ? b.genre === selectedGenre : true;
    const matchesSearch =
      query === "" ||
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.genre.toLowerCase().includes(query);
    return matchesGenre && matchesSearch;
  });
  const totalPages = Math.max(1, Math.ceil(visibleBooks.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedBooks = visibleBooks.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const avgPrice =
    allBooks.length > 0
      ? allBooks.reduce((s: number, b: Book) => s + b.price, 0) /
        allBooks.length
      : 0;

  const handleResetForm = () => {
    setFormData({
      title: "",
      author: "",
      genre: "",
      price: "",
      publishedYear: "",
    });
    setEditBook(null);
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBook({
      variables: {
        ...formData,
        price: parseFloat(formData.price),
        publishedYear: parseInt(formData.publishedYear),
      },
    });
    handleResetForm();
    refetch();
    createModalRef.current?.close();
  };

  const handleEditBook = (book: Book) => {
    setEditBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      price: book.price.toString(),
      publishedYear: book.publishedYear.toString(),
    });
    createModalRef.current?.showModal();
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBook({
      variables: {
        id: editBook?.id,
        ...formData,
        price: parseFloat(formData.price),
        publishedYear: parseInt(formData.publishedYear),
      },
    });
    refetch();
    handleResetForm();
    createModalRef.current?.close();
  };

  const handleDeleteBook = async (id: number) => {
    setDeletingId(id);
    await deleteBook({ variables: { id } });
    setDeletingId(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-10 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-5xl font-extrabold text-primary-content tracking-tight">
              Book Library
            </h1>
            <p className="text-primary-content/70 mt-1 text-base">
              Browse, add, and manage your collection
            </p>
          </div>
          <button
            className="btn btn-neutral btn-md gap-2 shadow"
            onClick={() => {
              handleResetForm();
              createModalRef.current?.showModal();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Book
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        {!loading && !error && (
          <div className="stats shadow mb-6 w-full bg-base-100">
            <div className="stat">
              <div className="stat-title">Total Books</div>
              <div className="stat-value text-primary">{allBooks.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Genres</div>
              <div className="stat-value text-secondary">{genres.length}</div>
            </div>
            {allBooks.length > 0 && (
              <div className="stat">
                <div className="stat-title">Avg. Price</div>
                <div className="stat-value text-accent">
                  ${avgPrice.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        {!loading && !error && (
          <label className="input input-bordered flex items-center gap-2 mb-6">
            <input
              type="text"
              className="grow"
              placeholder="Search by title, author or genre"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </label>
        )}

        {/* Genre Filter */}
        {!loading && !error && genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              className={`badge badge-lg cursor-pointer px-4 py-3 transition-all ${
                selectedGenre === null
                  ? "badge-primary"
                  : "badge-outline hover:badge-primary"
              }`}
              onClick={() => {
                setSelectedGenre(null);
                setCurrentPage(1);
              }}
            >
              All ({allBooks.length})
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                className={`badge badge-lg cursor-pointer px-4 py-3 transition-all ${
                  selectedGenre === genre
                    ? "badge-primary"
                    : "badge-outline hover:badge-primary"
                }`}
                onClick={() => {
                  setSelectedGenre(genre);
                  setCurrentPage(1);
                }}
              >
                {genre} (
                {allBooks.filter((b: Book) => b.genre === genre).length})
              </button>
            ))}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-xl">
                <div className="card-body gap-3">
                  <div className="skeleton h-6 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                  <div className="skeleton h-4 w-1/4 rounded-full" />
                  <div className="divider my-0" />
                  <div className="flex justify-between">
                    <div className="skeleton h-4 w-1/3 rounded" />
                    <div className="skeleton h-6 w-1/4 rounded" />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <div className="skeleton h-8 w-16 rounded" />
                    <div className="skeleton h-8 w-16 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div role="alert" className="alert alert-error shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Failed to load books. Please try again.</span>
            <button className="btn btn-sm" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && visibleBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-base-content/50">
            <span className="text-7xl">📭</span>
            <p className="text-xl font-medium">No books found</p>
            {selectedGenre && (
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setSelectedGenre(null)}
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* Book Grid */}
        {!loading && !error && visibleBooks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedBooks.map((book: Book) => (
              <BookCard
                key={book.id}
                book={book}
                handleEditBook={handleEditBook}
                handleDeleteBook={handleDeleteBook}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <Pagination
            safePage={safePage}
            totalPages={totalPages}
            visibleBooks={visibleBooks}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* Book Form Modal */}
      <Modal
        createModalRef={createModalRef}
        formData={formData}
        setFormData={setFormData}
        editBook={editBook}
        handleAddBook={handleAddBook}
        handleUpdateBook={handleUpdateBook}
        handleResetForm={handleResetForm}
      />
    </div>
  );
}

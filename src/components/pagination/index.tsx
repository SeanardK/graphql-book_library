import { Book } from "@/pages/api/books";
import React from "react";

interface PaginationProps {
  safePage: number;
  totalPages: number;
  visibleBooks: Book[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

function Pagination({
  safePage,
  totalPages,
  visibleBooks,
  setCurrentPage,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
      <p className="text-sm text-base-content/60">
        Page <span className="font-semibold text-base-content">{safePage}</span>{" "}
        of <span className="font-semibold text-base-content">{totalPages}</span>
        {" · "}
        {visibleBooks.length} book{visibleBooks.length !== 1 ? "s" : ""}
      </p>
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={safePage === 1}
          onClick={() => setCurrentPage(1)}
          aria-label="First page"
        >
          «
        </button>
        <button
          className="join-item btn btn-sm"
          disabled={safePage === 1}
          onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
          aria-label="Previous page"
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPages ||
              Math.abs(page - safePage) <= 1,
          )
          .reduce<(number | "...")[]>((acc, page, idx, arr) => {
            if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1)
              acc.push("...");
            acc.push(page);
            return acc;
          }, [])
          .map((item, idx) =>
            item === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="join-item btn btn-sm btn-disabled"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                className={`join-item btn btn-sm ${
                  item === safePage ? "btn-primary" : ""
                }`}
                onClick={() => setCurrentPage(item as number)}
              >
                {item}
              </button>
            ),
          )}
        <button
          className="join-item btn btn-sm"
          disabled={safePage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          className="join-item btn btn-sm"
          disabled={safePage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
}

export default Pagination;

import { Book } from "@/pages/api/books";
import React from "react";

interface ModalProps {
  createModalRef: React.RefObject<HTMLDialogElement | null>;
  editBook: Book | null;
  formData: {
    title: string;
    author: string;
    genre: string;
    price: string;
    publishedYear: string;
  };
  handleAddBook: (e: React.FormEvent) => void;
  handleUpdateBook: (e: React.FormEvent) => void;
  setFormData: (data: {
    title: string;
    author: string;
    genre: string;
    price: string;
    publishedYear: string;
  }) => void;
  handleResetForm: () => void;
}

function Modal({
  createModalRef,
  editBook,
  formData,
  handleAddBook,
  handleUpdateBook,
  setFormData,
  handleResetForm,
}: ModalProps) {
  return (
    <dialog
      id="create_modal"
      className="modal modal-bottom sm:modal-middle"
      ref={createModalRef}
    >
      <div className="modal-box">
        <h3 className="font-bold text-xl mb-4 text-primary">
          {editBook ? "Edit Book" : "Add a New Book"}
        </h3>
        <form
          onSubmit={editBook ? handleUpdateBook : handleAddBook}
          className="flex flex-col gap-3"
        >
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Title</span>
            </div>
            <input
              type="text"
              placeholder="Enter book title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Author</span>
            </div>
            <input
              type="text"
              placeholder="Enter author name"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Genre</span>
            </div>
            <input
              type="text"
              placeholder="e.g. Fiction, Fantasy, Mystery"
              value={formData.genre}
              onChange={(e) =>
                setFormData({ ...formData, genre: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Price ($)</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Published Year</span>
              </div>
              <input
                type="number"
                placeholder="e.g. 2024"
                min="1000"
                max="2100"
                value={formData.publishedYear}
                onChange={(e) =>
                  setFormData({ ...formData, publishedYear: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </label>
          </div>
          <div className="modal-action mt-2">
            <button
              type="button"
              onClick={() => {
                createModalRef.current?.close();
                handleResetForm();
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${editBook ? "btn-warning" : "btn-primary"}`}
            >
              {editBook ? "Save Changes" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleResetForm}>close</button>
      </form>
    </dialog>
  );
}

export default Modal;

# GraphQL Book Library

A full-stack book management application built with **Next.js**, **Apollo Server**, and **Apollo Client**. It demonstrates a complete GraphQL CRUD workflow; querying, filtering, paginating, and mutating data, all within a single Next.js project using the Pages Router.

---

## Features

- **Browse books** - Responsive card grid with pagination and genre filtering
- **Add books** - Create new entries via a modal form
- **Edit books** - Update any field of an existing book inline
- **Delete books** - Remove books with instant UI refresh
- **GraphQL API** - Apollo Server 4 served directly from a Next.js API route
- **Type-safe** - End-to-end TypeScript with shared interfaces

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (Pages Router, Turbopack) |
| Language | TypeScript 5 |
| GraphQL Server | [Apollo Server 4](https://www.apollographql.com/docs/apollo-server) + [@as-integrations/next](https://github.com/apollo-server-integrations/apollo-server-integration-next) |
| GraphQL Client | [Apollo Client 3](https://www.apollographql.com/docs/react) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com) + [DaisyUI v4](https://daisyui.com) |
| Package Manager | [pnpm](https://pnpm.io) |

---

## Project Structure

```
src/
├── datas/
│   └── books.ts          # In-memory seed data
├── lib/
│   └── graphql.tsx       # Apollo Client instance
├── pages/
│   ├── index.tsx         # Main UI — book list + CRUD forms
│   └── api/
│       └── books.ts      # GraphQL API route (Apollo Server)
└── styles/
    └── globals.css
```

---

## GraphQL API

The GraphQL endpoint is available at `POST /api/books`.

### Queries

```graphql
# Fetch books with optional pagination and genre filter
query Books($limit: Int, $offset: Int, $genre: String) {
  books(limit: $limit, offset: $offset, genre: $genre) {
    id
    title
    author
    publishedYear
    genre
    price
  }
}

# Fetch a single book by ID
query Book($id: Int) {
  book(id: $id) {
    id
    title
    author
    publishedYear
    genre
    price
  }
}
```

### Mutations

```graphql
mutation AddBook($title: String!, $author: String!, $price: Float!, $genre: String!, $publishedYear: Int!) {
  addBook(title: $title, author: $author, price: $price, genre: $genre, publishedYear: $publishedYear) {
    id
    title
  }
}

mutation UpdateBook($id: Float!, $title: String, $author: String, $price: Float, $genre: String, $publishedYear: Int) {
  updateBook(id: $id, title: $title, author: $author, price: $price, genre: $genre, publishedYear: $publishedYear) {
    id
    title
  }
}

mutation DeleteBook($id: Float!) {
  deleteBook(id: $id)
}
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- [pnpm](https://pnpm.io) v8 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/SeanardK/graphql-book_library
cd graphql-book_library

# Install dependencies
pnpm install
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

---

## How It Works

1. **Apollo Server** is initialized in `src/pages/api/books.ts` using `startServerAndCreateNextHandler` from `@as-integrations/next`, which wraps it as a standard Next.js API route handler.
2. **Schema & Resolvers** are defined in the same file. The resolver layer operates on an in-memory `books` array imported from `src/datas/books.ts`.
3. **Apollo Client** (`src/lib/graphql.tsx`) points to the local `/api/books` endpoint and uses an `InMemoryCache` for client-side caching.
4. The **front-end page** (`src/pages/index.tsx`) uses `useQuery` to fetch and display books, and `useMutation` to add, update, and delete them — calling `refetch()` after each mutation to keep the UI in sync.

---

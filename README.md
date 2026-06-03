# Book-Store API

REST API for a simple book store that manages books, customers, purchases, borrowing, and restocking.

## Features
- Manage books (CRUD, search, filter).
- Manage customers (CRUD, search by name).
- Purchase and borrow books with stock tracking.
- Return borrowed books with late fee calculation.
- Restock inventory and view restock history.

## Tech Stack
- Node.js + TypeScript
- Express
- MongoDB + Mongoose

## Getting Started

### Prerequisites
- Node.js 18+ (or 20+)
- MongoDB instance (local or Atlas)

### Install
```bash
npm install
```

### Environment Variables
Create a `.env` file in the project root:
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/book-store
PORT=3000
```

### Run
Development (watch mode):
```bash
npm run dev
```

Run once:
```bash
npx ts-node src/app.ts
```

Server starts at `http://localhost:3000` (or `PORT`).

## API Reference
Base URL: `/api`

### Books
- `GET /books` Get all books
- `GET /books/:id` Get book by id
- `POST /books` Add book
- `PUT /books/:id` Update book
- `DELETE /books/:id` Delete book
- `GET /books/search?key=TEXT` Search by title/author/ISBN
- `GET /books/filter?contentType=TYPE&category=CAT` Filter by type/category

**Add/Update Book Body**
```json
{
	"title": "Clean Code",
	"ISBN": "9780132350884",
	"author": "Robert C. Martin",
	"contentType": "scientific",
	"category": "mathematics",
	"totalCopies": 10,
	"availableCopies": 10,
	"salePrice": 25,
	"borrowPrice": 5,
	"minCopies": 3,
	"image": null
}
```

### Customers
- `GET /customers` Get all customers
- `GET /customers/:id` Get customer by id
- `POST /customers` Create customer
- `PUT /customers/:id` Update customer
- `DELETE /customers/:id` Delete customer
- `GET /customers/search?name=TEXT` Search by name

**Create/Update Customer Body**
```json
{
	"name": "Jane Doe",
	"phone": "+20-123-456-789",
	"address": "Cairo, EG"
}
```

### Transactions
- `GET /transactions` Get all transactions
- `GET /transactions/:id` Get transaction by id
- `POST /transactions/purchase` Purchase a book
- `POST /transactions/borrow` Borrow a book
- `PUT /transactions/return/:id` Return a borrowed book

**Purchase Body**
```json
{
	"bookId": "BOOK_OBJECT_ID",
	"name": "Jane Doe",
	"phone": "+20-123-456-789",
	"address": "Cairo, EG",
	"amountPaid": 50
}
```

**Borrow Body**
```json
{
	"bookId": "BOOK_OBJECT_ID",
	"name": "Jane Doe",
	"phone": "+20-123-456-789",
	"address": "Cairo, EG",
	"returnDueDate": "2026-07-01T00:00:00.000Z",
	"lateFeePerDay": 2
}
```

### Stock Purchases
- `GET /stock` Get restock history
- `GET /stock/:id` Get restock by id
- `POST /stock` Restock a book

**Restock Body**
```json
{
	"bookId": "BOOK_OBJECT_ID",
	"copiesAdded": 5,
	"notes": "Supplier delivery"
}
```

## Notes
- `contentType` values: `scientific`, `literary`, `historical`, `educational`
- `category` values: `novel`, `biography`, `physics`, `mathematics`
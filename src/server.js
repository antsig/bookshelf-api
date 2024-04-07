const express = require('express');
const { nanoid } = require('nanoid');

const app = express();
app.use(express.json());

let books = [];

// Function to filter books based on query parameters
function filterBooks(books, queryParams) {
  let filteredBooks = [...books];

  if (queryParams.name) {
    const nameQuery = queryParams.name.toLowerCase();
    filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(nameQuery));
  }

  if (queryParams.reading !== undefined) {
    const readingValue = queryParams.reading === '1' ? true : false;
    filteredBooks = filteredBooks.filter(book => book.reading === readingValue);
  }

  if (queryParams.finished !== undefined) {
    const finishedValue = queryParams.finished === '1' ? true : false;
    filteredBooks = filteredBooks.filter(book => book.finished === finishedValue);
  }

  return filteredBooks;
}

app.post('/books', (req, res) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

  if (!name) {
    return res.status(400).json({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' });
  }

  if (readPage > pageCount) {
    return res.status(400).json({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' });
  }

  const id = nanoid();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const book = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, insertedAt, updatedAt
  };

  books.push(book);

  return res.status(201).json({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } });
});

app.get('/books', (req, res) => {
  const queryParams = req.query;
  let filteredBooks = books;

  if (Object.keys(queryParams).length > 0) {
    filteredBooks = filterBooks(books, queryParams);
  }

  return res.status(200).json({ status: 'success', data: { books: filteredBooks } });
});

app.get('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ status: 'fail', message: 'Buku tidak ditemukan' });
  }

  return res.status(200).json({ status: 'success', data: { book } });
});

// Other routes for updating and deleting books

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

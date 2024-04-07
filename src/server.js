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

app.get('/books', (req, res) => {
  const queryParams = req.query;
  let filteredBooks = books;

  if (Object.keys(queryParams).length > 0) {
    filteredBooks = filterBooks(books, queryParams);
  }

  return res.status(200).json({ status: 'success', data: { books: filteredBooks } });
});

// Other routes for POST, PUT, DELETE methods

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

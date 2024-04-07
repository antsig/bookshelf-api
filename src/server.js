const Hapi = require('@hapi/hapi');
const { nanoid } = require('nanoid');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost'
  });

  let books = [];

  server.route({
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
      const queryParams = request.query;

      // Apply filtering based on query parameters
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

      return h.response({ status: 'success', data: { books: filteredBooks } }).code(200);
    }
  });

  server.route({
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

      // Validation checks
      if (!name) {
        return h.response({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' }).code(400);
      }

      if (readPage > pageCount) {
        return h.response({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);
      }

      // Generate unique id and timestamps
      const id = nanoid();
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;

      const book = {
        id, name, year, author, summary, publisher, pageCount, readPage, reading, insertedAt, updatedAt
      };

      // Add book to the collection
      books.push(book);

      return h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } }).code(201);
    }
  });

  // Add other routes for PUT and DELETE methods

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init().catch(err => {
  console.error(err);
  process.exit(1);
});

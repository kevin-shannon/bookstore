var pgp = require('pg-promise')({});

const cn = 'postgres://postgres:412@localhost:5432/bookstore';
const db = pgp(cn);

// Query functions

const getAllBooks = db.any('SELECT book_id, title.name, book.isbn, vendor.name AS vendor_name, author.name AS author_name, admin.username \
  FROM book, title, vendor, admin, author, written_by \
  WHERE book.ISBN = title.ISBN AND book.admin_id = admin.admin_id AND book.vendor_id = vendor.vendor_id AND title.isbn = written_by.isbn AND written_by.author_id = author.author_id;')
  .then((data) => {
    return data;
  })

const getAvailableTitles = db.any('SELECT name, rating, price FROM book, title WHERE book.ISBN = title.ISBN AND customer_id is null')
  .then((data) => {
    return data;
  })

const getAllVendors = db.any('SELECT * FROM Vendor')
  .then((data) => {
    console.log(data);
    return data;
  })

// Exports

exports.getAllBooks = getAllBooks;
exports.getAvailableTitles = getAvailableTitles;
exports.getAllVendors = getAllVendors;

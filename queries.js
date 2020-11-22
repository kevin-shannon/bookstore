var pgp = require('pg-promise')({});

const cn = 'postgres://postgres:412@localhost:5432/bookstore';
const db = pgp(cn);

const userify = ({username, password, admin}) => (username && password) ? `?username=${username}&password=${password}&admin=${admin}` : '';

// Query functions

const getAllBooks = () => db.any('SELECT book_id, title.name, book.isbn, vendor.name AS vendor_name, author.name AS author_name, admin.username \
  FROM book, title, vendor, admin, author, written_by \
  WHERE book.ISBN = title.ISBN AND book.admin_id = admin.admin_id AND book.vendor_id = vendor.vendor_id AND title.isbn = written_by.isbn AND written_by.author_id = author.author_id;');

const getAvailableTitles = () =>db.any('SELECT name, rating, price, title.isbn FROM book, title WHERE book.ISBN = title.ISBN AND customer_id is null');

const getAllVendors = () => db.any('SELECT * FROM Vendor');

const getCart = (username) => db.any('SELECT book_id, title.name, price, book.vendor_id, vendor.name AS vendor \
  FROM book, vendor, title, customer \
  WHERE book.customer_id = customer.customer_id AND customer.username = $1 AND book.isbn = title.isbn AND book.vendor_id = vendor.vendor_id;', username)

const getNumItems = (username) => db.one('SELECT COUNT(price) \
  FROM book, vendor, title, customer \
  WHERE book.customer_id = customer.customer_id AND customer.username = $1 AND book.isbn = title.isbn AND book.vendor_id = vendor.vendor_id;', username);

const getTotalPrice = (username) => db.one('SELECT SUM(price) \
FROM book, vendor, title, customer \
WHERE book.customer_id = customer.customer_id AND customer.username = $1 AND book.isbn = title.isbn AND book.vendor_id = vendor.vendor_id;', username);

const getTitle = (isbn) => db.one('SELECT * FROM title WHERE isbn = $1;', isbn)

const getSellers = (isbn) =>
  db.any('SELECT book_id, condition, admin.username AS published_by, admin.admin_id, vendor.name AS vendor, vendor.vendor_id \
    FROM book, admin, vendor \
    WHERE isbn = $1 and customer_id is null AND book.vendor_id = vendor.vendor_id AND book.admin_id = admin.admin_id;', isbn)

const getVendor = (vendor_id) => db.one('SELECT * FROM vendor WHERE vendor_id = $1', vendor_id);

const checkValidCustomer = (username, password) => db.one('SELECT * FROM customer WHERE username = $1 AND password = $2', [username, password]);

const checkValidAdmin = (username, password) => db.one('SELECT * FROM admin WHERE username = $1 AND password = $2', [username, password]);

// Modifiers

const addToCart = (book_id, username) => db.any('UPDATE book \
  SET customer_id = customer.customer_id \
  FROM customer \
  WHERE book.book_id = $1 AND customer.username = $2;', [book_id, username]);

const removeFromCart = (book_id, username) => db.any('UPDATE book \
  SET customer_id = NULL \
  FROM customer \
  WHERE book.book_id = $1 AND customer.username = $2;', [book_id, username]);

// Exports
module.exports = {
  userify,
  getAllBooks,
  getAvailableTitles,
  getAllVendors,
  getCart,
  getNumItems,
  getTotalPrice,
  getTitle,
  getSellers,
  getVendor,
  checkValidCustomer,
  checkValidAdmin,
  addToCart,
  removeFromCart
}

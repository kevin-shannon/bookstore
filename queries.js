var pgp = require('pg-promise')({});

const cn = 'postgres://postgres:412@localhost:5432/bookstore';
const db = pgp(cn);

const userify = ({id, password, admin}) => (id && password) ? `?id=${id}&password=${password}&admin=${admin}` : '';

// Query functions

const getAllBooks = () => db.any('SELECT book_id, title.name, book.isbn, vendor.name AS vendor_name, author.name AS author_name, admin.username \
  FROM book, title, vendor, admin, author, written_by \
  WHERE book.ISBN = title.ISBN AND book.admin_id = admin.admin_id AND book.vendor_id = vendor.vendor_id AND title.isbn = written_by.isbn AND written_by.author_id = author.author_id;');

const getAvailableTitles = () =>db.any('SELECT name, rating, price, title.isbn FROM book, title WHERE book.ISBN = title.ISBN AND customer_id is null');

const getAllVendors = () => db.any('SELECT * FROM Vendor');

const getCart = (customer_id) => db.any('SELECT book_id, title.name, price, book.vendor_id, vendor.name AS vendor \
  FROM book, vendor, title, customer \
  WHERE book.customer_id = customer.customer_id AND customer.customer_id = $1 AND book.isbn = title.isbn AND book.vendor_id = vendor.vendor_id;', customer_id)

const getNumItems = (customer_id) => db.one('SELECT COUNT(price) \
  FROM book, vendor, title, customer \
  WHERE book.customer_id = customer.customer_id AND customer.customer_id = $1 AND book.isbn = title.isbn AND book.vendor_id = vendor.vendor_id;', customer_id);

const getTotalPrice = (customer_id) => db.one('SELECT SUM(price) \
FROM book, vendor, title, customer \
WHERE book.customer_id = customer.customer_id AND customer.customer_id = $1 AND book.isbn = title.isbn AND book.vendor_id = vendor.vendor_id;', customer_id);

const getTitle = (isbn) => db.one('SELECT * FROM title WHERE isbn = $1;', isbn)

const getSellers = (isbn) =>
  db.any('SELECT book_id, condition, admin.username AS published_by, admin.admin_id, vendor.name AS vendor, vendor.vendor_id \
    FROM book, admin, vendor \
    WHERE isbn = $1 and customer_id is null AND book.vendor_id = vendor.vendor_id AND book.admin_id = admin.admin_id;', isbn)

const getVendor = (vendor_id) => db.one('SELECT * FROM vendor WHERE vendor_id = $1', vendor_id);

const getCustomer = (customer_id) => db.one('SELECT * FROM customer WHERE customer_id = $1', customer_id);

const checkValidCustomer = (customer_id, password) => db.one('SELECT * FROM customer WHERE customer_id = $1 AND password = $2', [customer_id, password]);

const checkValidAdmin = (admin_id, password) => db.one('SELECT * FROM admin WHERE admin_id = $1 AND password = $2', [admin_id, password]);

const getUserFromId = (id, admin) => admin ? db.one('SELECT username FROM admin WHERE admin_id = $1;', id) : db.one('SELECT username FROM customer WHERE customer_id = $1;', id)

// Modifiers

const addToCart = (book_id, customer_id) => {
  console.log(book_id, customer_id);
  return db.any('UPDATE book \
    SET customer_id = customer.customer_id \
    FROM customer \
    WHERE book.book_id = $1 AND customer.customer_id = $2;', [book_id, customer_id]);
  }

const removeFromCart = (book_id, customer_id) => db.any('UPDATE book \
  SET customer_id = NULL \
  FROM customer \
  WHERE book.book_id = $1 AND customer.customer_id = $2;', [book_id, customer_id]);

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
  getCustomer,
  checkValidCustomer,
  checkValidAdmin,
  addToCart,
  getUserFromId,
  removeFromCart
}

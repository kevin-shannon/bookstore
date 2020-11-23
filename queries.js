var pgp = require('pg-promise')({});

const cn = 'postgres://postgres:412@localhost:5432/bookstore';
const db = pgp(cn);

const userify = ({id, password, admin}) => (id && password) ? `?id=${id}&password=${password}&admin=${admin}` : '';

// Query functions

const getAllBooks = () => db.any("SELECT book_id, name, book_preview.isbn, vendor_name, author_list, published_by \
  FROM (SELECT book_id, title.name, book.isbn, vendor.name AS vendor_name, admin.username AS published_by \
        FROM book, title, vendor, admin \
        WHERE book.isbn = title.isbn AND book.admin_id = admin.admin_id AND book.vendor_id = vendor.vendor_id) AS book_preview \
  LEFT JOIN (SELECT isbn, STRING_AGG(name::character varying, ', ') author_list \
             FROM (SELECT isbn, name \
                   FROM written_by, author \
                   WHERE written_by.author_id = author.author_id) AS by_name GROUP BY isbn) AS agg_written_by \
  ON book_preview.isbn = agg_written_by.isbn;");

const getAvailableTitles = () => db.any('SELECT name, rating, MIN(price), title.isbn FROM book, title WHERE book.isbn = title.isbn AND customer_id is null GROUP BY title.isbn;');

const getAllTitles = () => db.any('SELECT name, rating, MIN(price) AS price, title.isbn FROM title LEFT JOIN book ON title.isbn = book.isbn GROUP BY title.isbn;');

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

const checkValidBook = ({isbn, vendor_id}) => {
  console.log(isbn, vendor_id);
  const i = db.one('SELECT isbn FROM title WHERE isbn = $1;', isbn);
  const v = db.one('SELECT vendor_id FROM vendor WHERE vendor_id = $1;', vendor_id);
  //const a = db.one('SELECT COUNT(author_id) FROM author WHERE author_id in ($1) HAVING COUNT(author_id) = $2;', author_list, author_list.replace(/[^,]/g, "").length+1);
  //const p = db.one('SELECT admin_id FROM book WHERE admin_id = $1;', admin_id);
  return Promise.all([i,v]);
}

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

const addCustomer = ({name, username, email, password, address, phone_number}) => {
  let customer_id = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
  return db.any('INSERT INTO customer (customer_id, email, address, phone_number, username, name, password) \
  VALUES ($1, $2, $3, $4, $5, $6, $7);', [customer_id, email, address, phone_number, username, name, password]);
}

const addTitle = (({isbn, name, published_date, rating}) =>
  db.any('INSERT INTO title (isbn, name, published_date, rating) \
  VALUES ($1, $2, $3, $4);', [isbn, name, published_date, rating])
)

const removeTitle = ((isbn) => db.any('DELETE FROM title WHERE isbn = $1;', isbn));

const addVendor = (({vendor_id, name, url, address}) =>
  db.any('INSERT INTO vendor (vendor_id, name, url, address) \
  VALUES ($1, $2, $3, $4);', [vendor_id, name, url, address])
)

const removeVendor = ((vendor_id) => db.any('DELETE FROM vendor WHERE vendor_id = $1;', vendor_id));

const addBook = (({book_id, condition, price, admin_id, vendor_id, isbn}) => {
  console.log(book_id, condition, price, admin_id, vendor_id, isbn)
  return db.any('INSERT INTO book (book_id, condition, price, admin_id, vendor_id, isbn) \
  VALUES ($1, $2, $3, $4, $5, $6);', [book_id, condition, price, admin_id, vendor_id, isbn]);
})

const removeBook = ((book_id) => db.any('DELETE FROM book WHERE book_id = $1;', book_id));

// Exports
module.exports = {
  userify,
  getAllBooks,
  getAvailableTitles,
  getAllTitles,
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
  checkValidBook,
  addToCart,
  getUserFromId,
  removeFromCart,
  addCustomer,
  addTitle,
  removeTitle,
  addVendor,
  removeVendor,
  addBook,
  removeBook
}

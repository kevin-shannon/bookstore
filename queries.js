var pgp = require('pg-promise')({});

const cn = 'postgres://postgres:412@localhost:5432/bookstore';
const db = pgp(cn);

const limit = 6;
const userify = ({id, password, admin}) => (id && password) ? `?id=${id}&password=${password}&admin=${admin}` : '';

// Query functions

const getAllBooks = (page) => db.any("SELECT book_id, name, book_preview.isbn, vendor_name, author_list, published_by \
  FROM (SELECT book_id, title.name, book.isbn, vendor.name AS vendor_name, admin.username AS published_by \
        FROM book, title, vendor, admin \
        WHERE book.isbn = title.isbn AND book.admin_id = admin.admin_id AND book.vendor_id = vendor.vendor_id) AS book_preview \
  LEFT JOIN (SELECT isbn, STRING_AGG(name::character varying, ', ') author_list \
             FROM (SELECT isbn, name \
                   FROM written_by, author \
                   WHERE written_by.author_id = author.author_id) AS by_name GROUP BY isbn) AS agg_written_by \
  ON book_preview.isbn = agg_written_by.isbn \
  LIMIT $1 OFFSET $2;", [limit, limit*(page-1)]);

const getNumBookPages = () => db.one("SELECT COUNT(*) FROM book").then((count) => Math.ceil(count.count / limit))

const getAvailableTitles = (page) => db.any("SELECT name, rating, price, title_agg.isbn, genre_list, author_list \
  FROM (SELECT name, rating, price, title_agg.isbn, genre_list \
        FROM (SELECT isbn, STRING_AGG(type, ', ') AS genre_list FROM categorized_by GROUP BY isbn) AS genre_agg, \
             (SELECT name, rating, MIN(price) AS price, title.isbn FROM title, book WHERE title.isbn = book.isbn AND book.customer_id is null GROUP BY title.isbn) AS title_agg \
        WHERE genre_agg.isbn = title_agg.isbn) AS title_agg \
  LEFT JOIN (SELECT isbn, STRING_AGG(name::character varying, ', ') author_list \
             FROM (SELECT isbn, name \
                   FROM written_by, author \
                   WHERE written_by.author_id = author.author_id) AS by_name GROUP BY isbn) AS written_by_agg \
  ON title_agg.isbn = written_by_agg.isbn \
  LIMIT $1 OFFSET $2;", [limit, limit*(page-1)]);

const getNumAvailTitlePages = () => db.one("SELECT COUNT(*) FROM (SELECT title.isbn FROM title, book WHERE title.isbn = book.isbn AND book.customer_id is null GROUP BY title.isbn) AS title_agg;").then((count) => Math.ceil(count.count / limit));

const getAllTitles = (page) => db.any("SELECT name, rating, price, title_agg.isbn, genre_list, author_list \
  FROM (SELECT name, rating, price, title_agg.isbn, genre_list \
        FROM (SELECT isbn, STRING_AGG(type, ', ') AS genre_list FROM categorized_by GROUP BY isbn) AS genre_agg, \
             (SELECT name, rating, MIN(price) AS price, title.isbn FROM title LEFT JOIN book ON title.isbn = book.isbn GROUP BY title.isbn) AS title_agg \
        WHERE genre_agg.isbn = title_agg.isbn) AS title_agg \
  LEFT JOIN (SELECT isbn, STRING_AGG(name::character varying, ', ') author_list \
             FROM (SELECT isbn, name \
                   FROM written_by, author \
                   WHERE written_by.author_id = author.author_id) AS by_name GROUP BY isbn) AS written_by_agg \
  ON title_agg.isbn = written_by_agg.isbn \
  LIMIT $1 OFFSET $2;", [limit, limit*(page-1)]);

const getNumAllTitlePages = () => db.one("SELECT COUNT(*) FROM title").then((count) => Math.ceil(count.count / limit));

const getAllVendors = () => db.any('SELECT * FROM vendor');

const getAllAuthors = () => db.any('SELECT * FROM author');

const getCart = (customer_id) => db.any('SELECT book_id, title.name, price, book.vendor_id, vendor.name AS vendor \
  FROM book, vendor, title \
  WHERE book.customer_id = $1 AND book.isbn = title.isbn AND book.vendor_id = vendor.vendor_id;', customer_id)

const getNumItems = (customer_id) => db.one('SELECT COUNT(price) \
  FROM book, vendor, title \
  WHERE book.customer_id = $1 AND book.isbn = title.isbn AND book.vendor_id = vendor.vendor_id;', customer_id);

const getTotalPrice = (customer_id) => db.one('SELECT SUM(price) FROM book, vendor, title \
  WHERE book.customer_id = $1 AND book.isbn = title.isbn AND book.vendor_id = vendor.vendor_id;', customer_id);

const getTitle = (isbn) => db.one("SELECT name, rating, price, published_date, title_agg.isbn, genre_list, author_list \
  FROM (SELECT name, rating, price, published_date, title_agg.isbn, genre_list \
        FROM (SELECT isbn, STRING_AGG(type, ', ') AS genre_list FROM categorized_by GROUP BY isbn) AS genre_agg, \
             (SELECT name, rating, MIN(price) AS price, published_date, title.isbn FROM title LEFT JOIN book ON title.isbn = book.isbn GROUP BY title.isbn) AS title_agg \
        WHERE genre_agg.isbn = title_agg.isbn) AS title_agg \
  LEFT JOIN (SELECT isbn, STRING_AGG(name::character varying, ', ') author_list \
             FROM (SELECT isbn, name \
                   FROM written_by, author \
                   WHERE written_by.author_id = author.author_id) AS by_name GROUP BY isbn) AS written_by_agg \
  ON title_agg.isbn = written_by_agg.isbn \
  WHERE title_agg.isbn = $1;", isbn);

const getSellers = (isbn) => db.any('SELECT book_id, condition, admin.username AS published_by, admin.admin_id, vendor.name AS vendor, vendor.vendor_id, price \
  FROM book, admin, vendor \
  WHERE isbn = $1 and customer_id is null AND book.vendor_id = vendor.vendor_id AND book.admin_id = admin.admin_id;', isbn)

const getVendor = (vendor_id) => db.one('SELECT * FROM vendor WHERE vendor_id = $1;', vendor_id);

const getCustomers = () => db.any('SELECT username, name, address, email, customer_id FROM customer;');

const getCustomer = (customer_id) => db.one('SELECT * FROM customer WHERE customer_id = $1;', customer_id);

const checkValidCustomer = (customer_id, password) => db.one('SELECT * FROM customer WHERE customer_id = $1 AND password = $2;', [customer_id, password]);

const checkValidAdmin = (admin_id, password) => db.one('SELECT * FROM admin WHERE admin_id = $1 AND password = $2;', [admin_id, password]);

const checkValidTitle = ({genre_list, author_list}) => {
  g = db.one('SELECT COUNT(type) FROM genre WHERE type in (${genre_list:raw}) HAVING COUNT(type) = ${length};', {genre_list: genre_list.split(',').map(s => `'${s}'`).join(', '), length: genre_list.replace(/[^,]/g, "").length+1});
  if (author_list)
    a = db.one('SELECT COUNT(author_id) FROM author WHERE author_id in ($1:raw) HAVING COUNT(author_id) = $2;', [author_list, author_list.replace(/[^,]/g, "").length+1]);
  else
    a = Promise.resolve();
  return Promise.all([g,a]);
}

const checkValidBook = ({isbn, vendor_id}) => {
  const i = db.one('SELECT isbn FROM title WHERE isbn = $1;', isbn);
  const v = db.one('SELECT vendor_id FROM vendor WHERE vendor_id = $1;', vendor_id);
  return Promise.all([i,v]);
}

const getUserFromId = (id, admin) => admin ? db.one('SELECT username FROM admin WHERE admin_id = $1;', id) : db.one('SELECT username FROM customer WHERE customer_id = $1;', id)

// Modifiers

const addToCart = (book_id, customer_id) => db.none('UPDATE book SET customer_id = customer.customer_id FROM customer \
  WHERE book.book_id = $1 AND customer.customer_id = $2;', [book_id, customer_id]);

const removeFromCart = (book_id, customer_id) => db.none('UPDATE book SET customer_id = NULL FROM customer \
  WHERE book.book_id = $1 AND customer.customer_id = $2;', [book_id, customer_id]);

const addCustomer = ({name, username, email, password, address, phone_number}) => {
  let customer_id = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
  return db.none('INSERT INTO customer (customer_id, email, address, phone_number, username, name, password) \
  VALUES ($1, $2, $3, $4, $5, $6, $7);', [customer_id, email, address, phone_number, username, name, password]);
}

const addTitle = ({isbn, name, published_date, rating, genre_list, author_list}) => {
  const t = db.none('INSERT INTO title (isbn, name, published_date, rating) \
  VALUES ($1, $2, $3, $4);', [isbn, name, published_date, rating]);

  let genre_values = [];
  for (const type of genre_list.split(',')) {
    genre_values.push({isbn, type});
  }

  let author_values = [];
  if (author_list) {
    for (const author_id of author_list.split(',').map(Number)) {
      author_values.push({isbn, author_id});
    }
  }

  const gcs = new pgp.helpers.ColumnSet(['isbn', 'type'], {table: 'categorized_by'});
  const acs = new pgp.helpers.ColumnSet(['isbn', 'author_id'], {table: 'written_by'});

  const g = db.none(pgp.helpers.insert(genre_values, gcs));
  if (author_values != false)
    a = db.none(pgp.helpers.insert(author_values, acs));
  else
    a = Promise.resolve();

  return Promise.all([t,g,a]);
};

const removeTitle = ((isbn) => db.any('DELETE FROM title WHERE isbn = $1;', isbn));

const addVendor = ({vendor_id, name, url, address}) => db.none('INSERT INTO vendor (vendor_id, name, url, address) \
  VALUES ($1, $2, $3, $4);', [vendor_id, name, url, address]);


const removeVendor = (vendor_id) => db.none('DELETE FROM vendor WHERE vendor_id = $1;', vendor_id);

const addBook = ({book_id, condition, price, admin_id, vendor_id, isbn}) => db.none('INSERT INTO book (book_id, condition, price, admin_id, vendor_id, isbn) \
  VALUES ($1, $2, $3, $4, $5, $6);', [book_id, condition, price, admin_id, vendor_id, isbn]);

const removeBook = (book_id) => db.none('DELETE FROM book WHERE book_id = $1;', book_id);

const addAuthor = ({author_id, name, url, address}) => db.none('INSERT INTO author (author_id, name, url, address) \
  VALUES ($1, $2, $3, $4);', [author_id, name, url, address]);

const removeAuthor = (author_id) => db.none('DELETE FROM author WHERE author_id = $1;', author_id);

const removeCustomer = (customer_id) => db.none('DELETE FROM customer WHERE customer_id = $1', customer_id);

// Exports
module.exports = {
  userify,
  getAllBooks,
  getNumBookPages,
  getAvailableTitles,
  getNumAvailTitlePages,
  getAllTitles,
  getNumAllTitlePages,
  getAllVendors,
  getAllAuthors,
  getCart,
  getNumItems,
  getTotalPrice,
  getTitle,
  getSellers,
  getVendor,
  getCustomers,
  getCustomer,
  checkValidCustomer,
  checkValidAdmin,
  checkValidTitle,
  checkValidBook,
  addToCart,
  getUserFromId,
  removeFromCart,
  addCustomer,
  addTitle,
  removeTitle,
  addVendor,
  removeVendor,
  addAuthor,
  removeAuthor,
  addBook,
  removeBook,
  removeCustomer
}

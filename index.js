const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');

// Init App
const app = express()
const port = 3000
var db = require('./queries.js')

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.locals.id = req.query.id;
  res.locals.page = ''
  res.locals.path = req.path;
  res.locals.loginInfo = db.userify(req.query);
  res.locals.admin = parseInt(req.query.admin);
  if (res.locals.id ) {
    db.getUserFromId(req.query.id, res.locals.admin).then((username) => {
      res.locals.username = username.username;
      next();
    }).catch(() => {
      next();
    });
  } else {
    next();
  }
})

// Home Route
app.get('/', (req, res) => {
  res.render('index', {})
})

// Add Routes
app.get('/login', (req, res) => {
  const {id, password, admin} = req.query;
  if (!id) {
    res.render('login', {
      success: false
    })
  }
  else {
    const check = (id, password) => parseInt(admin) ? db.checkValidAdmin(id, password) : db.checkValidCustomer(id, password);
    check(id, password).then((user) => {
      res.render('login', {
        success: true
      })
    })
    .catch(() => {
      res.redirect(req.path)
    })
  }
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/books/:page', (req, res) => {
  const page = req.params.page;

  const c = db.getAllBooks(page);
  const n = db.getNumBookPages();

  Promise.all([c,n]).then(([books, maxPage]) => {
    res.render('books', {
      books,
      page,
      maxPage
    })
  })
})

app.get('/titles/:page', (req, res) => {
  const page = req.params.page;
  const chooseTable = () => parseInt(req.query.admin) ? db.getAllTitles(page) : db.getAvailableTitles(page);
  const choosePages = () => parseInt(req.query.admin) ? db.getNumAllTitlePages() : db.getNumAvailTitlePages();

  const t = chooseTable();
  const p = choosePages();

  Promise.all([t,p]).then(([titles, maxPage]) => {
    res.render('titles', {
      titles,
      page,
      maxPage
    })
  })
})

app.get('/vendors', (req, res) => {
  db.getAllVendors().then((vendors) => {
    res.render('vendors', {
      vendors
    })
  });
})

app.get('/authors', (req, res) => {
  db.getAllAuthors().then((authors) => {
    res.render('authors', {
      authors
    })
  });
})

app.get('/title/:isbn', (req, res) => {
  const t = db.getTitle(req.params.isbn)
  const s = db.getSellers(req.params.isbn)

  Promise.all([t,s]).then(([title,sellers]) => {
    res.render('title', {
      title,
      sellers
    })
  })
})

app.get('/vendors/:vendor_id', (req, res) => {
  db.getVendor(req.params.vendor_id).then((vendor) => {
    res.render('vendor', {
      vendor
    })
  });
})

app.get('/cart', (req, res) => {
  const c = db.getCart(req.query.id)
  const n = db.getNumItems(req.query.id)
  const p = db.getTotalPrice(req.query.id)

  Promise.all([c,n,p]).then(([cart, numItems, totalPrice]) => {
    res.render('cart', {
      cart,
      numItems,
      totalPrice
    })
  })
})

app.get('/profile/:customer_id', (req, res) => {
  db.getCustomer(req.params.customer_id).then((user) => {
    res.render('profile', {
      user
    })
  })
})

app.get('/customers', (req, res) => {
  db.getCustomers().then((customers) => {
    res.render('customers', {
      customers
    })
  })
})

// Post Requests
app.post('/cart/add', (req, res) => {
  db.addToCart(req.body.book_id, req.body.customer_id).then(() => {
    res.redirect('/cart' + req.body.loginInfo);
  })
})

app.post('/cart/remove', (req, res) => {
  db.removeFromCart(req.body.book_id, req.body.customer_id).then(() => {
    res.redirect('/cart' + req.body.loginInfo);
  })
})

app.post('/register', (req, res) => {
  db.addCustomer(req.body).then((customer) => {
    const loginInfo = db.userify({id: customer.customer_id, password: customer.password, admin: 0})
    res.redirect('/login' + loginInfo);
  })
})

app.post('/titles/add', (req, res) => {
  db.checkValidTitle(req.body).then(() =>{
    db.addTitle(req.body).then(() => {
      res.redirect('/titles' + req.body.loginInfo);
    })
  }).catch((result) => {
    res.redirect('/titles' + req.body.loginInfo);
  })
})

app.post('/titles/remove', (req, res) => {
  db.removeTitle(req.body.isbn).then(() => {
    res.redirect('/titles' + req.body.loginInfo);
  })
})

app.post('/vendors/add', (req, res) => {
  db.addVendor(req.body).then(() => {
    res.redirect('/vendors' + req.body.loginInfo);
  })
})

app.post('/vendors/remove', (req, res) => {
  db.removeVendor(req.body.vendor_id).then(() => {
    res.redirect('/vendors' + req.body.loginInfo);
  })
})

app.post('/authors/add', (req, res) => {
  db.addAuthor(req.body).then(() => {
    res.redirect('/authors' + req.body.loginInfo);
  })
})

app.post('/authors/remove', (req, res) => {
  db.removeAuthor(req.body.author_id).then(() => {
    res.redirect('/authors' + req.body.loginInfo);
  })
})

app.post('/books/add', (req, res) => {
  console.log(req.originalUrl);
  db.checkValidBook(req.body).then(() =>{
    db.addBook(req.body).then(() => {
      res.redirect('/books/1' + req.body.loginInfo);
    })
  }).catch(() => {
    res.redirect('/books/1' + req.body.loginInfo);
  })
})

app.post('/books/remove', (req, res) => {
  console.log(req.originalUrl);
  db.removeBook(req.body.book_id).then(() => {
    res.redirect('/books/1' + req.body.loginInfo);
  })
})

app.post('/customers/remove', (req, res) => {
  db.removeCustomer(req.body.customer_id).then(() => {
    res.redirect('/customers' + req.body.loginInfo);
  })
})

// Start Server
app.listen(port, () => {
  console.log(`Bookstore app listening at http://localhost:${port}`);
})

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
  res.locals.path = req.path;
  res.locals.loginInfo = db.userify(req.query);
  res.locals.admin = parseInt(req.query.admin);
  if (res.locals.id ) {
    db.getUserFromId(req.query.id, res.locals.admin).then((username) => {
      res.locals.username = username.username;
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
      res.redirect(req.path);
    })
  }
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/books', (req, res) => {
  db.getAllBooks().then((books) => {
    res.render('books', {
      books
    })
  });
})

app.get('/titles', (req, res) => {
  const choose = () => parseInt(req.query.admin) ? db.getAllTitles() : db.getAvailableTitles();
  choose().then((titles) => {
    res.render('titles', {
      titles
    })
  });
})

app.get('/vendors', (req, res) => {
  db.getAllVendors().then((vendors) => {
    res.render('vendors', {
      vendors
    })
  });
})

app.get('/titles/:isbn', (req, res) => {
  let t = db.getTitle(req.params.isbn)
  let s = db.getSellers(req.params.isbn)

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
  let c = db.getCart(req.query.id)
  let n = db.getNumItems(req.query.id)
  let p = db.getTotalPrice(req.query.id)

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
  db.addTitle(req.body).then(() => {
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

// Start Server
app.listen(port, () => {
  console.log(`Bookstore app listening at http://localhost:${port}`)
})

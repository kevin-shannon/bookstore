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
  res.locals.username = req.query.username;
  res.locals.path = req.path;
  res.locals.loginInfo = db.userify(req.query);
  res.locals.admin = parseInt(req.query.admin);
  next();
})

// Home Route
app.get('/', (req, res) => {
  res.render('index', {
    title:'Home',
  })
})

// Add Routes
app.get('/login', (req, res) => {
  const {username, password, admin} = req.query;
  if (!username) {
    res.render('login', {
      success: false
    })
  }
  else {
    const check = (username, password) => parseInt(admin) ? db.checkValidAdmin(username, password) : db.checkValidCustomer(username, password);
    check(username, password).then((user) => {
      res.render('login', {
        success: true
      })
    })
    .catch(() => {
      res.redirect(req.path);
    })
  }
})

app.get('/books', (req, res) => {
  db.getAllBooks().then((books) => {
    res.render('books', {
      title: 'Books',
      books
    })
  });
})

app.get('/titles', (req, res) => {
  db.getAvailableTitles().then((titles) => {
    res.render('titles', {
      title: 'Titles',
      titles
    })
  });
})

app.get('/vendors', (req, res) => {
  db.getAllVendors().then((vendors) => {
    res.render('vendors', {
      title: 'Vendors',
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
  let c = db.getCart(req.query.username)
  let n = db.getNumItems(req.query.username)
  let p = db.getTotalPrice(req.query.username)

  Promise.all([c,n,p]).then(([cart, numItems, totalPrice]) => {
    res.render('cart', {
      cart,
      numItems,
      totalPrice
    })
  })
})

app.get('/profile/:username', (req, res) => {
  db.getCustomer(req.params.username).then((user) => {
    res.render('profile', {
      user
    })
  })
})

// Post Requests
app.post('/cart/add', (req, res) => {
  db.addToCart(req.body.book_id, req.body.username).then(() => {
    res.redirect('/cart' + req.body.loginInfo);
  })
})

app.post('/cart/remove', (req, res) => {
  db.removeFromCart(req.body.book_id, req.body.username).then(() => {
    res.redirect('/cart' + req.body.loginInfo);
  })
})


// Start Server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

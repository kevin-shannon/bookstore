const express = require('express');
const path = require('path');

// Init App
const app = express()
const port = 3000
var db = require('./queries.js')

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home Route
app.get('/', (req, res) => {
  res.render('index', {
    title:'Home',
  })
})

// Add Routes
app.get('/books', function(req, res) {
  db.getAllBooks.then((data) => {
    res.render('books', {
      title:'Books',
      books: data
    })
  });
})

app.get('/titles', function(req, res) {
  db.getAvailableTitles.then((data) => {
    res.render('titles', {
      title:'Titles',
      titles: data
    })
  });
})

app.get('/vendors', function(req, res) {
  db.getAllVendors.then((data) => {
    res.render('vendors', {
      title:'Vendors',
      vendors: data
    })
  });
})

// Start Server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

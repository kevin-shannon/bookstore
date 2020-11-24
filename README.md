# bookstore
CSE 412 Group Project

For our project we decided to build a tool that could be used by a bookstore to allow customers to browse and checkout books. This website serves as an interface to our database that makes it easy to query and update.

This project is built using [node-js](https://nodejs.org/en/) as our run-time environment, [express](https://expressjs.com/) as our web framework, [pug](https://pugjs.org/api/getting-started.html) as our template engine, and [postgresql](https://www.postgresql.org/download/) as our database system.

## Installation
To get this tool running on your own machine there are couple steps you'll need to take that we will outline below. We are going to create two servers, one for the database and one for the website. We will be running it off of localhost, but if this were a real website to be deployed we could host it elsewhere with ports forwarded.

### Clone
```
git clone git@github.com:kevin-shannon/bookstore.git
cd bookstore/
```

### Database Setup
Go to `databse/` to find a database dump(`bookstore.sql`) that will serve as a starting point for our database.
```
cd database/
```
Make sure you have [postgresql](https://www.postgresql.org/download/) installed and your paths correctly set.

We will be using a user with `username: postgres` and `password: 412` make sure your's is set up the same.

Create the database
```
createdb bookstore
```

Import the database
```
psql bookstore < bookstore.sql
```

### Getting Node Server Running
Install [node-js](https://nodejs.org/en/).

From the project's root directory install the npm packages
```
npm i
```
Start the node server
```
npm start
```
All done! the website is up and ready to be explored. If the index page works but the links don't, it probably means you didn't set up the database correctly, make sure the password for the postgres user is `412`.

## Usage
Go to http://localhost:3000/ in your browser.

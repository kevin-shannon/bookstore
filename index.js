const pg = require('pg');
const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bookstore',
  password: '412',
  port: '5432'
});


const http = require('http');

http.createServer((request, response) => {
  const { headers, method, url } = request;
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    response.on('error', (err) => {
      console.error(err);
    });

    response.writeHead(200, {'Content-Type': 'application/json'})

    pool.query("SELECT * FROM Book", (err, res) => {
      console.log(err, res);
      response.end(JSON.stringify(res['rows']))
    });
  });
}).listen(8080);

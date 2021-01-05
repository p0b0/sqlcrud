require('dotenv').config();


const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const getUsers = require('./queries');
const { Pool, Client } = require('pg');



const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PW;
const dbPort = process.env.DB_PORT;


const pool = new Pool({
  user: user,
  host: host,
  database: dbName,
  password: dbPassword,
  port: dbPort,
})


app.set('view engine', 'ejs');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/index", (req, res, next)=> {
  pool.connect();
  pool.query('SELECT * FROM products', (err, que)=> {
    if (err) {
      throw err;
    } else {
      const products = que.rows;
      console.log(products);
      res.render('index', {products});
    }
  })
});

app.get("/", (req, res)=> {
    res.render("home")
});

app.post("/", (req, res)=>{
  const product = req.body;
  const queryText = 'INSERT INTO products(name, price, quantity, location) VALUES ($1, $2, $3, $4);';
  const input = [product.name, product.price, product.quantity, product.location];

  pool.connect();
  pool.query(queryText, input, (err, que)=> {
    if (err) {
      throw err;
    } else {
      console.log(que);
    }
  })
res.send("just created a new product!")
    
})

app.get('/:id' , async(req, res)=> {
  try {
  const id = [req.params.id];
  const queryText = 'SELECT * FROM products WHERE id=$1';
  await pool.connect();
  const queryResult = await pool.query(queryText, id);
  const product = queryResult.rows[0];
  res.render('show', {product});
  } catch(e) {
    console.log(e);
  }
  
})

const port = 3000;
app.listen(port, ()=>{
    console.log(`listening on ${port}` )
});


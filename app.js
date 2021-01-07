require('dotenv').config();


const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const getUsers = require('./queries');
const { Pool, Client } = require('pg');
const methodOverride = require('method-override');



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
app.use(methodOverride('_method'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/index", async(req, res)=> {
  await pool.connect();
  const pro = await pool.query('SELECT * FROM products')
  const products = pro.rows;
  res.render('index', {products});
});

app.get("/", (req, res)=> {
    res.render("home")
});

app.post("/", async(req, res)=>{
  const product = req.body;
  const queryText = 'INSERT INTO products(name, price, quantity, location) VALUES ($1, $2, $3, $4);';
  const input = [product.name, product.price, product.quantity, product.location];

 await pool.connect();
 await pool.query(queryText, input);
res.redirect('/index');
    
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

app.put('/:id', async(req, res)=> {
  
  const input = [req.body.name, req.body.price, req.body.quantity, req.body.location, req.params.id];
  const queryText = 'UPDATE products SET name=$1, price=$2, quantity=$3, location=$4 WHERE id=$5';
  await pool.connect();
  const queryResult = await pool.query(queryText, input);
  res.redirect('/index');
  
})

app.get('/:id/edit', async(req, res)=>{
  const id = [req.params.id];
  const queryText = 'SELECT * FROM products WHERE id=$1';
  await pool.connect();
  const queryResult = await pool.query(queryText, id);
  const product = queryResult.rows[0];
  res.render('edit', {product});
})

app.delete('/:id', async(req, res)=> {
  const id = [req.params.id];
  const queryText = 'DELETE FROM products WHERE id=$1';
  const queryResult = await pool.query(queryText, id);
  res.redirect('/index');
})



const port = 3000;
app.listen(port, ()=>{
    console.log(`listening on ${port}` )
});


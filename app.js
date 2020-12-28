
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res)=> {
    res.render("home")
});

app.post("/", (req, res)=>{
    res.send(req.body);
    // console.log();

   
 
  
    
})

const port = 3000;
app.listen(port, ()=>{
    console.log(`listening on ${port}` )
});
const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5500;




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.af2ol.mongodb.net/${process.env.USER_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("tech").collection("products");
  
  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      console.log('add Product', newProduct);
      productCollection.insertOne(newProduct)
      .then(result => {
          console.log('insertedCount', result.insertedCount);
          res.send(result.insertedCount> 0);
      })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World! I am')
})

app.listen(port);
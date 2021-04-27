const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const port = process.env.PORT || 5500;




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.af2ol.mongodb.net/${process.env.USER_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("tech").collection("products");
  const orderCollection = client.db("tech").collection("orders");

  // add product
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('add Product', newProduct);
    productCollection.insertOne(newProduct)
      .then(result => {
        console.log(result.insertedCount > 0);
        res.send(result.insertedCount > 0);
      })
  })

  // get product
  app.get('/products', (req, res) => {
    const searchProduct = req.query.search;
    productCollection.find({name: {$regex: searchProduct}})
      .toArray((err, productInfo) => {
        res.send(productInfo);
      })
  })

  // load specific product
  app.get('/products/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, singleProduct) => {
      res.send(singleProduct[0]);
    })
  })

  // add order
  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    console.log('newOrder', newOrder);
    orderCollection.insertOne(newOrder)
      .then(result => {
        console.log(result.insertedCount > 0);
        res.send(result.insertedCount > 0);
      })
  })

  // get order
  app.get('/orders', (req, res) => {
    orderCollection.find({email: req.query.email})
    .toArray( (err, document) => {
      console.log('ordered', document);
      res.send(document);
    })
  })

  // delete product
  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      console.log('deleted successfully');
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port);
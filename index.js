const express = require('express')
const app = express()
const port = process.env.PORT || 5500;

app.get('/', (req, res) => {
  res.send('Hello World! I am Mahfuz')
})

app.listen(port);
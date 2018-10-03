const express = require('express')
const app = express()
const port = 3000

const data = {
  a: 1,
  b: 2
}

app.get('/', (req, res) => res.json(data))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

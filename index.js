const parseString = require('xml2js').parseString
const express = require('express')
const fetch = require('node-fetch')
const app = express()
const port = 3000
let data = {}

fetch('http://rss.smg.gov.mo/c_ActualWeather_rss.xml')
  .then(function (res) {
    return res.text()
  })
  .then(function (body) {
    parseString(body, (err, result) => {
      data = result
    })
  })

app.get('/', (req, res) => res.json(data))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

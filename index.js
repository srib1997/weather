const parseString = require('xml2js').parseString
const express = require('express')
const fetch = require('node-fetch')
const cron = require('node-cron')
const app = express()
const port = 3000
let data = {}

const fetchWeather = function () {
  console.log('fetching...' + new Date())
  fetch('http://rss.smg.gov.mo/c_ActualWeather_rss.xml')
    .then(function (res) {
      return res.text()
    })
    .then(function (body) {
      parseString(body, (err, result) => {
        data = result
      })
    })
}

fetchWeather()
cron.schedule('0 * * * * *', fetchWeather)

app.get('/', (req, res) => {
  const description = data.rss.channel[0].item[0].description[0]

  const newResult = {
    pubDate: data.rss.channel[0].pubDate[0],
    title: data.rss.channel[0].item[0].title[0],
    time: description.match(/在 (.*)/)[1],
    temperature: description.match(/溫度: (.*) /)[1],
    humidity: description.match(/濕度: (.*) /)[1],
    windDirection: description.match(/風向: (.*) ; /)[1],
    windVelocity: description.match(/風速: (.*) /)[1]
  }
  res.json(newResult)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

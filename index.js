const parseString = require('xml2js').parseString
const express = require('express')
const fetch = require('node-fetch')
const cron = require('node-cron')
const app = express()
const port = 3000
let data = {}
let data2 = {}

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

const fetchForcast = function () { 
  fetch('http://rss.smg.gov.mo/c_WForecast_rss.xml')
    .then(function (res) {
      return res.text()
    })
    .then(function (body) {
      parseString(body, (err, result) => {
        data2 = result
      })
    })
}

fetchForcast()
cron.schedule('0 * * * * *', fetchForcast)

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

app.get('/forcast', (req, res) => {
  const description2 = data2.rss.channel[0].item[0].description[0]

   const newResult2 = {
     pubDate: data2.rss.channel[0].pubDate[0],
     title: data2.rss.channel[0].item[0].title[0],
     WeatherDate: description2.match(/預測於 (.*)/)[1],
     WeatherForecast: description2.match(/天氣乾燥。(.*)/)[0],
     WeatherDateTomorrow: description2.match(/預測於 (.*)/)[2]
     }
  res.json(newResult2)
}
)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

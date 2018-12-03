const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const db = require('../models')

const router = express.Router()

router
  // Route for getting all Articles from the db and sending them back as json
  .get('/', function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    // Empty object for all of the articles
    db.Article.find({})
      .then(function (dbArticle) {
        res.render('index', { articles: dbArticle })
      })
      .catch(function (err) {
        res.json(err)
      })
  })

  .get('/scrape', function (req, res) {
    axios.get('https://www.npr.org/').then(function (response) {
      const $ = cheerio.load(response.data)

      $('.story-text a').each(function (i, element) {
        // Save an empty result object
        let result = {}

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children('h3')
          .text()
        result.link = $(this)
          // .children('a')
          .attr('href')
        result.summary = $(this)
          .siblings('a')
          .children('.teaser')
          .text()

        console.log(result)
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle)
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err)
          })
      })
      location.replace('/')
      // Send a message to the client
      res.send('Scrape Complete')
    })
  })

module.exports = router

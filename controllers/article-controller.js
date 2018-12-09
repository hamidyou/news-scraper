const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { split, findIndex, compose, not, eq, slice, join, pipe, dropWhile, take } = require('kyanite')

const db = require('../models')

const router = express.Router()

router
  .get('/', (req, res) => {
    res.render('index')
  })
  // Route for getting all Articles from the db and sending them back as json
  .get('/Articles/', (req, res) => {
    // TODO: Finish the route so it grabs all of the articles
    // Empty object for all of the articles
    db.Article.find({}).sort([['date', 'desc'], ['title', 'asc']])
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

        // const getIndex = link => findIndex(x => x === '2018', split('/', link))

        // const getDate = idx => slice(idx, idx + 3, split('/', result.link))
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
          .text() ||
          'No Summary available'
        result.date = pipe([
          split('/'),
          dropWhile(compose(not, eq('2018'))),
          take(3),
          join('/')
        ], result.link)

        console.log(result.date)
        // Create a new Article using the `result` object built from scraping
        db.Article.insertMany(result, { ordered: false })
          .then(function (dbArticle) {
            // View the added result in the console
            return dbArticle
          })
          .catch(function (err) {
            // If an error occurred, log it
            return err
          })
      })
      // Send a message to the client
      res.send('Scrape Complete')
    })
  })

module.exports = router

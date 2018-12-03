const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const db = require('../models')

const router = express.Router()

router
  .get('/', function (req, res) {
    res.render('index')
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

      // Send a message to the client
      res.send('Scrape Complete')
    })
  })

  // Route for getting all Articles from the db and sending them back as json
  .get('/articles', function (req, res) {
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

  // Route for grabbing a specific Article by id, populate it with it's note
  .get('/articles/:id', function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({ _id: req.params.id })
      // Looking for the note key
      .populate('note')
      .then(function (article) {
        // Sending back the article to the client
        res.json(article)
      })
      .catch(function (err) {
        res.json(err)
      })
  })

  // Route for saving/updating an Article's associated Note
  .post('/articles/:id', function (req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    // Create is used for a single insert and multiple inserts (use an object)
    db.Note.create(req.body)
      .then(function (dbNote) {
        // Need to specify new: true so that if it doesnt exist it will be created for us
        // findoneandupdate has three parameters, what are we finding, where are we updating, and what are we doing
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
      })
      .then(function (dbArticle) {
        res.json(dbArticle)
      })
      .catch(function (err) {
        res.json(err)
      })
  })

module.exports = router

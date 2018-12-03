const express = require('express')

const db = require('../models')

const router = express.Router()

router
  .post('/articles/:id', function (req, res) {
    console.log(req.body)
    console.log(req.params)
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          comments: {
            $each: [{
              author: req.body.author,
              body: req.body.body
            }],
            $position: 0
          }
        }
      },
      { upsert: true, new: true })
      .then(function (dbArticle) {
        console.log(dbArticle)
        res.json(dbArticle)
      })
      .catch(function (err) {
        res.json(err)
      })
  })

module.exports = router

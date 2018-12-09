const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const articles = require('./controllers/article-controller')
const comments = require('./controllers/comments-controller')

const PORT = process.env.PORT || 8080

// Initialize Express
const app = express()

app
  .engine('handlebars',
    exphbs({ defaultLayout: 'main' }))
  .set('view engine', 'handlebars')
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(express.static('public'))
  .use(articles)
  .use(comments)

// Integrating Heroku deployment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/Article'

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

// Start the server
app.listen(PORT, () => {
  console.log('App running on port ' + PORT + '!')
})

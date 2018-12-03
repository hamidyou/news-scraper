const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const articles = require('./controllers/article-controller')

const PORT = 3000

// Initialize Express
const app = express()

app
  .engine('handlebars', exphbs({ defaultLayout: 'main' }))
  .set('view engine', 'handlebars')
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(express.static('public'))
  .use(articles)
// Connect to the Mongo DB
mongoose.connect('mongodb://localhost/Article', { useNewUrlParser: true })

// Start the server
app.listen(PORT, () => {
  console.log('App running on port ' + PORT + '!')
})

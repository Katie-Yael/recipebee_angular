var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var db = require('./db.js')

var dotenv = require('dotenv').config()

// routes requires go here
var users = require('./Routes/users')
var landing = require('./Routes/landing')
var books = require('./Routes/books')
var recipes = require('./Routes/recipes')

app.use(cors())
app.use(bodyParser.urlencoded({extended: true, limit: '25mb', extended:true}))
app.use(bodyParser.json({limit: '25mb', extended:true}))
app.use(morgan('dev'));

// declare path here 
app.use('/api/users/', users)
app.use('/api/landing/', landing)
app.use('/api/books/', books)
app.use('/api/books/recipes/', recipes)

var port = process.env.PORT || 8080

app.listen(port, console.log('Sweet sensations on port', port))


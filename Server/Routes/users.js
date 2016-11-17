var express = require('express')
var router = express.Router()
var db = require('../db.js')
var auth = require('../auth.js')


router.get('/', function (req, res) {
	var token = req.headers.token
	var getUsers = function () {
		db.query('SELECT `fullName`, `id`, `username`, `createdAt`, `email` FROM USERS;',
			function (err, rows) {
				if (err) {
					console.error(err)
					res.status(404).json({success: false})
				} else {
					res.json(rows)
				}
			})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, getUsers, error)
})




router.get('/user/:name', function (req, res) {
	var token = req.headers.token
	var username = req.headers.username
	var getUserInfo = function () {
		db.query('SELECT `fullName`, `id`, `username`, `createdAt`, `email` FROM USERS WHERE `username` = ?;',
		 [username], 
		 function (err, rows) {
			if (err) {
				console.error(err)
				res.status(404).json({success: false})
			} else {
				res.json(rows)
			}
		})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, getUserInfo, error)
})



router.get('/user/:name/books', function (req, res) {
	var username = req.headers.username
	var token = req.headers.token
	var getBooks = function () {
		db.query('SELECT BOOKS.bookName, BOOKS.code FROM BOOKS INNER JOIN BOOKUSERS ON BOOKS.id = BOOKUSERS.book_id INNER JOIN USERS ON BOOKUSERS.user_id = USERS.id WHERE USERS.username = ?;',
		 [username],
		 function (err, rows) {
			if (err) {
				console.error(err) 
				res.status(404).json({success: false})
			} else {
				res.status(200).json(rows)
			}
		})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, getBooks, error)
})


router.get('/user/:name/saved', function (req, res) {
	var username = req.headers.username
	var token = req.headers.token
	var getSavedRecipes = 'SELECT BOOKS.bookName, RECIPES.attachment, RECIPES.createdAt ' 
	'FROM RECIPES ' +
	'INNER JOIN SAVEDRECIPES ON RECIPES.id = SAVEDRECIPES.reipe_id ' +
	'INNER JOIN SAVED ON SAVEDRECIPES.saved_id = SAVED.id ' +
	'INNER JOIN USERS ON SAVED.user_id = USERS.id ' +
	'INNER JOIN BOOKS ON RECIPES.recipe_id = BOOKS.id ' +
	'WHERE USERS.username = ?;'
	var getSaved = function () {
		db.query(getSavedNotes,
			[username],
			function (err, rows) {
				if (err) {
					console.error(err) 
					res.status(404).json({success: false})
				} else {
					res.status(200).json(rows)
				}
		})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, getSaved, error)
})

module.exports = router
var express = require('express')
var router = express.Router()
var db = require('../db.js')
var auth = require('../auth.js')


router.get('/', function (req, res) {
	var token = req.headers.token
	var getAllBooks = function () {
		db.query('SELECT `bookName`, `createdAt` FROM BOOKS;', 
			function (err, rows) {
			if(err) {
				console.error(err)
				res.status(404).json({success:false})
			} else {
				res.json(rows)
			}
		})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, getAllBooks, error)
})


router.get('/book/:bookName', function (req, res) {
	var token = req.headers.token
	var name = req.params.bookName
	var getBookInfo = function () {
		db.query('SELECT `bookName`, `createdAt` FROM BOOKS WHERE `bookName` = ?;', 
			[name], 
			function (err, rows) {
			if(err) {
				console.error(err)
				res.status(404).json({success:false})
			} else {
				res.json(rows)
			}
		})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, getBookInfo, error)
})


router.get('/book/:bookName/users', function (req, res) {
	var token = req.headers.token
	var name = req.params.bookName
	var query = 'SELECT USERS.username, USERS.fullName FROM USERS ' + 
	'INNER JOIN BOOKUSERS ON USERS.id = BOOKUSERS.user_id ' + 
	'INNER JOIN BOOKS ON BOOKUSERS.book_id = BOOKS.id ' + 
	'WHERE BOOKS.bookName = ?;'
	var getUsersInBook = function () {
		db.query(query, [name], 
			function (err, rows) {
			if(err) {
				console.error(err)
				res.status(404).json({success:false})
			} else {
				res.json(rows)
			}
		})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, getUsersInBook, error)
})

// return all recipes in that book based on the book's name
router.get('/book/:bookName/recipes', function (req, res) {
	var token = req.headers.token
	var username = req.headers.username
	var name = req.params.bookName
	var errorSent = false;
	var arrSaved;
	var bookRecipes;
	var query = 'SELECT RECIPES.id, RECIPES.attachment, RECIPES.createdAt, BOOKS.code, USERS.username AS `author`, TAGS.name AS `tags` FROM RECIPES ' + 
	'INNER JOIN TAGRECIPES ON TAGRECIPES.recipe_id = RECIPES.id ' +
	'INNER JOIN TAGS ON TAGRECIPES.tag_id = TAGS.id ' +
	'INNER JOIN USERS ON RECIPES.user_id = USERS.id ' + 
	'INNER JOIN BOOKS ON RECIPES.book_id = BOOKS.id ' +
	'WHERE BOOKS.bookName = ? ORDER BY RECIPES.createdAt DESC;'
	var query2 = 'SELECT SAVEDRECIPES.recipe_id FROM SAVEDRECIPES INNER JOIN SAVED ON SAVED.id = SAVEDRECIPES.saved_id INNER JOIN USERS ON USERS.id = SAVED.user_id WHERE USERS.username = ?;'

	// get user's saved recipes [{recipesID 1}, {recipesID 2}]
	db.query(query2,
		[username],
	  function (err, result) {
	  	if (err) {
	  		if(!errorSent) {
	  			console.error(err)
	  			res.status(404).json({success:false})
	  		}
	  	} else {
	  		arrSaved = result;
	  	}
	})

	var getAllRecipesInBook = function () {
		db.query(query, 
			[name], 
			function (err, rows) {
			if(err) {
				if(!errorSent) {
					console.error(err)
					res.status(404).json({success:false})
				}
			} else {
				bookRecipes = rows
				for (var i = 0; i < bookRecipes.length; i++) {
					var brecipesID = bookRecipes[i].id 
					for (var j = 0; j < arrSaved.length - 1; j++) {
						if (brecipeID === arrSaved[i].recipe_id) {
							bookRecipes[i].saved = true
							break;
						} else {
							bookRecipes[i].saved = false
						}
					}
				}
				res.json(bookRecipes)
			}
		})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, getAllRecipesInBook, error)
})

function genRandomString() {
    return Math.round((Math.pow(36, 6) - Math.random() * Math.pow(36, 5))).toString(36).slice(1);
}


router.post('/', function (req, res) {
	var token = req.headers.token
	var code = genRandomString()
	var name = req.body.book.bookName
	var username = req.headers.username
	var createBook = function () {
		db.query('INSERT INTO BOOKS SET `bookName` = ?, `code` = ?;',
			[name, code],
			function (err, result1) {
				if(err) {
					console.error(err)
				} else {
					db.query('SELECT `id` FROM USERS WHERE `username` = ?;',
						[username],
						function (err, result2) {
							if(err) {
								console.error(err)
							} else {
								db.query('INSERT INTO BOOKUSERS SET `user_id` = ?, `book_id` = ?;', 
									[result2[0].id, result1.insertId],
									function (err, rows) {
										if(err) {
											console.error(err)
											res.status(500).json({success:false})
										} else {
											res.status(201).json({code:code})
										}
									})
							}
						})
				}
			})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, createBook, error)
})


router.post('/book/adduser', function (req, res) {
	var token = req.headers.token
	var code = req.body.book.code
	var classroom = req.body.book.bookName
	var username = req.headers.username
	var addUserToBook = function () {
		db.query('SELECT `id` FROM USERS WHERE `username` = ?;', 
			[username], 
			function (err, result1) {
				if(err) {
					console.error(err)
				} else {
					db.query('SELECT `id`, `code` FROM BOOKS WHERE `bookName` = ?;', 
						[book], 
						function (err, result2) {
							if (err) {
								console.error(err)
							} else {
								if (result2.length === 0 || result2[0].code === undefined || result2[0].id === undefined) {
									res.status(500).json({success:false})
								}
								else if (result2[0].code === code) {
									db.query('INSERT INTO BOOKUSERS SET user_id = ?, book_id = ?;', 
										[result1[0].id, result2[0].id],
										function (err, rows) {
											if(err) {
												console.error(err)
											} else {
												res.status(201).json({success:true})
											}
										})
								}
							}
						})
				}
			})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, addUserToBook, error)
})


router.post('/book/removeuser', function (req, res) {
	var token = req.headers.token
	var classroom = req.body.book.bookName
	var username = req.headers.username
	var removeUserFromBook = function () {
		db.query('SELECT `id` FROM USERS WHERE `username` = ?;', 
			[username], 
			function (err, result1) {
				if(err) {
					console.error(err)
				} else {
					db.query('SELECT `id` FROM BOOKS WHERE `bookName` = ?;', 
						[book], 
						function (err, result2) {
							if(err) {
								console.error(err)
							} else {
								if (result1[0] === undefined || result2[0] === undefined) {
								res.status(500).json({success:false});
							} else {
									db.query('DELETE FROM BOOKUSERS WHERE book_id = ? AND user_id = ?;',
										[result2[0].id, result1[0].id], 
										function (err, rows) {
											if(err) {
												console.error(err)
											} else {
												res.status(201).json({success:true})
											}
										})
								}
							}
						})
				}
			})
	}
	var error = function () {
		res.status(404).json({success: false, tokenValid: false})
	}
	auth.verifyToken(token, removeUserFromBook, error)
})

module.exports = router

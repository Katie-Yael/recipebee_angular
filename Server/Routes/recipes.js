var express = require('express')
var router = express.Router()
var db = require('../db.js')
var AWS = require('aws-sdk')
var credentials = require('../credentials.js')
var auth = require('../auth.js')

function generateRandomString() {
    return Math.round((Math.pow(36, 6) - Math.random() * Math.pow(36, 5))).toString(36).slice(1)
}

AWS.config.update({accessKeyId: credentials.accessKeyId, secretAccessKey: credentials.secretAccessKey, region: 'us-west-1'})

 

router.post('/', function (req, res) {
  var token = req.headers.token
  var key = generateRandomString();
  var base64image = req.body.attachment.base64
  var postRecipe = function () {
	  sendToS3(base64image, key)
	  .then(function(data) {
	  	var attachment = data;
	  	var tags = req.body.tags.name
	  	var user = req.headers.username
	  	var book = req.body.book.bookName
	  	db.query('SELECT `id` FROM USERS WHERE `username` = ?;', 
	  		[user], 
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
	  							  	db.query('INSERT INTO RECIPES SET `attachment` = ?, `user_id` = ?, `book_id` = ?;',
	  								[attachment, result1[0].id, result2[0].id],
	  								function (err, result3) {
	  									if(err) {
	  										console.error(err)
	  									} else {
	  										db.query('INSERT INTO TAGS SET `name` = ?;', 
	  											[tags], 
	  											function (err, result4) {
	  												if(err) {
	  													console.error(err)
	  												} else {
	  													db.query('INSERT INTO TAGRECIPES SET `recipe_id` = ?, `tag_id` = ?;',
	  														[result3.insertId, result4.insertId],
	  														function (err, rows) {
	  															if(err) {
	  																console.error(err)
	  																res.status()
	  															} else {
	  																res.status(201).json({success:true})
	  															}
	  														})
	  												}
	  											})
	  									}
	  								})
	  							  }
	  							
	  						}
	  					})
	  			}
	  		})
	  })
  }
  var error = function () {
  	res.status(404).json({success: false, tokenValid: false})
  }
  auth.verifyToken(token, postRecipe, error)
})


// The Recipe is inserted into the SAVEDRECIPES join table after retrieval of username and userid
router.post('/save', function (req, res) {
	var token = req.headers.token
	var username = req.headers.username
	var recipeId = req.body.recipes.recipeId
	var saveRecipe = function () {
		db.query('SELECT `id` FROM USERS WHERE `username` = ?;',
			[username],
			function (err, rows) {
				if (err) {
					console.error(err)
					res.status(500).json({success:false})
				} else {
					var userId = rows[0].id
					db.query('SELECT `id` FROM SAVED WHERE `user_id` = ?;',
						[userId],
						function (err, result) {
							if (err) {
								console.error(err)
								res.status(500).json({success:false})
							} else {
								var savedId = result[0].id
								db.query('INSERT INTO SAVEDRECIPES SET `recipe_id` = ?, `saved_id` = ?;',
									[recipeId, savedId],
									function (err, result2) {
										if (err) {
											console.error(err)
											res.status(500).json({success:false})
										} else {
											res.status(201).json({success: true})
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
	auth.verifyToken(token, saveRecipe, error)
})

// creates a new bucket and uploads the base64 image data to that bucket
function sendToS3 (img, key) {
  var s3 = new AWS.S3()
  return new Promise(function(resolve, reject) {
    s3.createBucket({Bucket: 'recipebee.bucket'}, function() {
      var buffer = new Buffer(img.replace(/'data:image\/\w+base64,/, ""),'base64')
      var params = {Bucket: 'recipebee.bucket', ContentEncoding: 'base64', ContentType:'image/jpg', ACL: 'public-read', Key: key, Body: buffer}
      s3.upload(params, function(err, data) {
      if (err) {  
          reject(err);   
      } else {    
          resolve(data.Location);
      }
    })
   });
  }).catch(function(err) {
    console.log('Error')
  })
};

module.exports = router

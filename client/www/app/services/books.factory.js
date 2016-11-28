(function () {
  'use strict'

  angular
    .module('recipebee')
    .factory('Books', Books)

  function Books (AWS_URL, $http) {
    return {
      create: function (book) {
        return $http.post(AWS_URL + '/books', {
          book: {
            bookName: book
          },
          user: {
            username: username
          }
        })
      },

      all: function() {
        return $http.get(AWS_URL + '/books')
      },

      joined: function (user) {
        return $http.get(AWS_URL + '/users/user/' + user + '/books')
      },

      join: function (book, code, username) {
        return $http.post(AWS_URL + '/books/book/adduser', {
          book: {
            bookName: book,
            code: code
          },
          user: {
            username: username
          }
        })
      },

      leave: function (book, username) {
        return $http.post(AWS_URL + '/books/book/removeuser', {
          book: {
            bookName: book
          },
          user: {
            username: username
          }
        })
      }
    }
  }
})()

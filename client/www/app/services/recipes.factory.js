(function () {
  'use strict'

  angular
    .module('recipebee')
    .factory('Recipes', Recipes)

  function Recipes (AWS_URL, $http) {
    return {
      for: function (book) {
        return $http.get(AWS_URL + '/books/book/' + book + '/recipes')
      },

      save: function (recipe) {
        $http.post(AWS_URL + '/books/recipes/save', {
          recipes: {
            recipeId: recipe
          }
        })
      },

      saved: function (user) {
        return $http.get(AWS_URL + '/users/user/' + user + '/saved')
      },

      create: function (author, book, attachment, tags) {
        return $http.post(AWS_URL + '/books/recipes', {
          user: {
            username: author
          },
          book: {
            bookName: book
          },
          attachment: {
            base64: attachment
          },
          tags: {
            name: tags
          }
        })
      }
    }
  }
})()

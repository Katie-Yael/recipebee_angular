(function () {
  'use strict'

  angular
    .module('recipebee.books')
    .config(config)

  function config ($stateProvider) {
    $stateProvider
      .state('tab.books', {
        url: '/books',
        views: {
          'tab-books': {
            templateUrl: 'app/books/books.html',
            controller: 'BooksController as books'
          }
        }
      })
  }
})()

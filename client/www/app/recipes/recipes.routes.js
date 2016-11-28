(function () {
  'use strict'

  angular
    .module('recipebee.recipes')
    .config(config)

  function config ($stateProvider) {
    $stateProvider
      .state('tab.recipes', {
        url: '/recipes/:book',
        views: {
          'tab-books': {
            templateUrl: 'app/recipes/recipes.html',
            controller: 'RecipesController as recipes'
          }
        }
      })
  }
})()

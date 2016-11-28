(function () {
  'use strict'

  angular
    .module('recipebee.saved')
    .config(config)

  function config ($stateProvider) {
    $stateProvider
      .state('tab.saved', {
        url: '/saved',
        views: {
          'tab-saved': {
            templateUrl: 'app/saved/saved.html',
            controller: 'SavedController as saved'
          }
        }
      })
  }
})()

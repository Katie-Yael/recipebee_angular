(function () {
  'use strict'

  angular
    .module('recipebee')
    .config(config)

  function config ($stateProvider) {
    $stateProvider
      .state('tab', {
        abstract: true,
        url: '/tab',
        templateUrl: 'app/layout/tabs.html'
      })
  }
})()

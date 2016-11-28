(function () {
  'use strict'

  angular
    .module('recipebee.settings')
    .config(config)

  function config ($stateProvider) {
    $stateProvider
      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'app/settings/settings.html',
            controller: 'SettingsController as settings'
          }
        }
      })
  }
})()

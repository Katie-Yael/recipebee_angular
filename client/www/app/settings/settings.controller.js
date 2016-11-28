(function () {
  'use strict'

  angular
    .module('recipebee.settings')
    .controller('SettingsController', SettingsController)

  function SettingsController (Auth, $state) {
    // Initialize
    var vm = this

    
    vm.signOut = signOut

    // Implement
    function signOut () {
      Auth.signOut()
    }
  }
})()

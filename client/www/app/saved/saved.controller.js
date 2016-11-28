(function () {
  'use strict'

  angular
    .module('recipebee.saved')
    .controller('SavedController', SavedController)

  function SavedController (Auth, Recipes) {
    // Initialization
    var vm = this
    activate()

    // Variables
    vm.recipes = []

    

    // Implementing
    function activate () {
      Recipes.saved(Auth.current().username).success(function (data) {
        vm.recipes = data
      })
    }
  }
})()

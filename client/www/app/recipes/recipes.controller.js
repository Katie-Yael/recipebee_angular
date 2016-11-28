(function () {
  'use strict'

  angular
    .module('recipebee.recipes')
    .controller('RecipesController', RecipesController)

  function RecipesController (Auth, Recipes, $cordovaCamera, $ionicModal, $scope, $stateParams) {
    // Initialization
    var vm = this
    activate()

    // Variables
    vm.author = Auth.current().username
    vm.book = $stateParams.book
    vm.modal
    vm.newPhoto
    vm.recipes = []
    vm.query
    vm.tags

    // Functions
    vm.create = create
    vm.save = save
    vm.selectPhoto = selectPhoto
    vm.takePhoto = takePhoto
    vm.upload = upload

    // Implementation Details
    function activate () {
      Recipes.for(vm.book).success(function (data) {
        vm.recipes = data.map(function (recipe) {
          recipe.tags = recipe.tags.split(' ')
          return recipe
        })
      })
    }

    function create () {
      $ionicModal.fromTemplateUrl('app/recipes/new.html', {scope: $scope})
        .then(function (modal) {
          vm.modal = modal
          vm.modal.show()
        })
    }

    function save (recipe) {
      Recipes.save(recipe)
    }

    function selectPhoto () {
      $cordovaCamera.getPicture({destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.PHOTOLIBRARY, quality: 75})
        .then(function (image) {
          vm.newPhoto = image
        })
    }

    function takePhoto () {
      $cordovaCamera.getPicture({destinationType: Camera.DestinationType.DATA_URL, quality: 75})
        .then(function (image) {
          vm.newPhoto = image
        })
    }

    function upload () {
      Recipes.create(vm.author, vm.book, vm.newPhoto, vm.tags).success(function (data) {
        vm.newPhoto = null
        vm.tags = null
      })

      vm.modal.remove()
      activate()
    }
  }
})()

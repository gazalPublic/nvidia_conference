'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('ListCtrl', function ($http,$scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
     var vm = this;
    $http.get('https:localhost:8443/data').success(function(data){
        //console.log(data);
        vm.data = data;
        vm.getCsv();
    }).error(function(error){
        console.log(error);
    });
    vm.getCsv = function(){
        console.log('get Csv');
        vm.dataforcsv={};
        for(var i=0;i<vm.data.length;i++){
            delete vm.data[i].speakerInfo;
        }
        vm.dataforcsv=vm.data;
        console.log(vm.dataforcsv);
        $scope.getArray = vm.dataforcsv;
    };
    
  });

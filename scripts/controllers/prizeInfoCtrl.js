'use strict';

angular.module('redApp')
  .controller('PrizeInfoCtrl', ['$rootScope','$scope','$stateParams','$state','HttpService','UtilService',function ($rootScope,$scope,$stateParams,$state,HttpService,UtilService) {
    $scope.telOk=false;
    $scope.checkTel=function () {
      if ($scope.tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) {
        $scope.telOk=true;
      }
      else{
        $scope.telOk=false;
        UtilService.messager.tip("电话格式不正确");
      }
    };
    $scope.submitInfo=function () {
        HttpService.httpRequest("drawPage","submitInfo",{
          "id":$stateParams.prizeId,//奖品id,从抽奖页传过来
          "userId":$rootScope.userId,
          "address":$scope.address,
          "name":$scope.name,
          "mobile":$scope.tel
        }).then(function(data){
          if(data.data==true){
            UtilService.messager.tip("提交成功",true,function(){
              history.back();
            });
          }
        });

    }

  }]);

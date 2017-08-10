/**
 * Created by lenovo on 2017/1/11.
 */
angular.module('redApp')
  .controller('passwordCtrl',['$scope','$rootScope','UtilService','HttpService','$state','WxService',function ($scope,$rootScope,UtilService,HttpService,$state,WxService) {

    $scope.setPwd = function(){
      if($scope.pwd.length>=6 && $scope.pwd.length<=12){
        var params = {
          mobile:$scope.telNum,
          password:$scope.pwd,
          code:$rootScope.inviteCode,
          registerToken:$scope.registerToken
        }
        HttpService.httpRequest('user', 'registerUser', params)
          .then(function(data){
            $scope.account = data.data.account;
            $scope.userId = data.data.userId;
            $scope.token = data.data.token;
            $rootScope.inviteCode = data.data.leadCode;   //用户自己的邀请码
            $rootScope.nickName = $scope.telNum.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3");
            if($rootScope.ending=="wx"){
              WxService.wxShare(2,"resultShareInfo");
            }
            $state.go('luckyPacket.register.password.connect');
          });
      }
    }


  }])


/**
 * Created by qiangxl on 2017/1/9.
 */
angular.module('redApp').controller('DrawCtrl',['$rootScope','$state','$scope','$interval','HttpService','UtilService','MobileService',function ($rootScope,$state,$scope,$interval,HttpService,UtilService,MobileService) {
  // if(MobileService.isMobile.XDM()){
    $scope.isFirst=false;

    $rootScope.$on("getUserInfoOk",function () {
      window.xdm.getDeviceCode('', function(data){$scope.deviceCode=data;});
    });

    HttpService.httpRequest("drawPage","showBriberryList",{}).then(function (data) {
      $scope.showBriberryList=data.data;
    });
    //如果是抽奖页面，20秒刷新中奖信息列表
    $interval(function () {
      if($state.current.name=='drawPage'){
        HttpService.httpRequest("drawPage","showBriberryList",{ignoreLoading:true}).then(function (data) {
          $scope.showBriberryList=data.data;
        });
      }
    },20000);



    $scope.startdraw=function () {
      if($scope.isFirst){
        //第一次抽奖用url传来的红包id
        var urlParams=UtilService.getUrlParams(["id","amount"]);
        $scope.briberyId=urlParams.id;
        $scope.briberyAmount=urlParams.amount;
        UtilService.messager.dialog(1, [{
          "txt": "确定", "callback": golottery}, {"txt": "取消", "callback": function () {}}], {title: "", msg: "确定要用" + $scope.briberyAmount + "元红包换取一次抽奖机会？"});
      }else{
        //第二次抽奖调接口获取红包
        HttpService.httpRequest("drawPage","lotteryBriberry",{"userId":$rootScope.userId}).then(function (data) {
          $scope.briberyId = data.data.id;//红包id
          $scope.briberyAmount = data.data.amount;
          UtilService.messager.dialog(1, [{
            "txt": "确定", "callback": golottery}, {"txt": "取消", "callback": function () {}}], {title: "", msg: "确定要用" + $scope.briberyAmount + "元红包换取一次抽奖机会？"});
        });
      }
    };

    function golottery(){
      if($scope.isFirst){$scope.isFirst=false;}
      HttpService.httpRequest("drawPage","lottery",{"token":$rootScope.token,"id":$scope.briberyId,"deviceCode":$scope.deviceCode,"nickName":$rootScope.nickName}).then(function (data) {
        var initDeg=0;
        $scope.prizeId=data.data.id;//奖品id传给prizeInfo页面
        $scope.prizeType=data.data.type;//奖品类型
        if($scope.prizeType==1){
          $scope.money=data.data.prizeLevel;
          switch ($scope.money){
            case 2:
              initDeg=-20;
              break;
            case 3:
              initDeg=100;
              break;
            case 5:
              initDeg=160;
              break;
          }
          $scope.KinerLottery.goKinerLottery(random(initDeg));
        }
        if($scope.prizeType==2){
          $scope.prizeLevel=data.data.prizeLevel;
          $scope.prizeName=data.data.prizeName;
          switch ($scope.prizeLevel){
            case 1:
              initDeg=40;
              break;
            case 2:
              initDeg=220;
              break;
            case 3:
              initDeg=280;
              break;
          }
          $scope.KinerLottery.goKinerLottery(random(initDeg));
        }
      })
    }
    function random(initDeg) {
      return initDeg+Math.floor(Math.random() * 40);
    }
  // }
}]);



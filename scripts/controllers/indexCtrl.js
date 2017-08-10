'use strict';

/**
 * @ngdoc function
 * @name redApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the redApp
 */
angular.module('redApp')
.controller('indexCtrl', ['$scope','$rootScope','$interval','HttpService','UtilService','MobileService',function ($scope,$rootScope,$interval,HttpService,UtilService,MobileService) {
  $scope.nonePrize=0;
  // window.xdm.setTitleBar(JSON.stringify({title:'邀请送红包',color:'#1f1f29'}), function(data){});
  // //获取活动状态
  // HttpService.httpRequest('user', 'getActivityStatus', {})
  // .then(function(data) {
  //   if(data.data){
  //     $("#init_mask").remove();
  //     UtilService.messager.tip(data.errorMsg,false);
  //   }else{
  //       var timer=$interval(function () {
  //          // 调用APP接口获取token
  //         window.xdm.getUserInfo('', function(data){
  //           $("#init_mask").remove();
  //           $scope.getUserCallback(data);
  //           $interval.cancel(timer);
  //         });
  //       },400,10);
  //       timer.then(function(){
  //         if(!$rootScope.token){
  //           UtilService.messager.tip("获取用户信息失败，请退出重试~",false);
  //         }
  //       });
  //   }
  // });
      $rootScope.$on("getUserInfoOk",function () {
        $scope.getUserCallback();
      });
      $scope.getUserCallback=function () {

        HttpService.httpRequest("indexPage","briberyLeft",{"token":$rootScope.token}).then(function (data) {
          $scope.leftnum=data.data.leftNumber;
          $rootScope.inviteCode=data.data.leadCode;//邀请码，分享的时候带出去
          MobileService.shareConfig.shareInfo.showDialog = 0;
          window.xdm.callShare(JSON.stringify(MobileService.shareConfig.changeShareInfo("resultShareInfo")),function(d){
            _czc.push(['_trackEvent','红包首页','分享次数','分享给好友']);
          });
        });
        HttpService.httpRequest("indexPage","briberyTotal",{"token":$rootScope.token}).then(function (data) {
          $scope.bribery=data.data.bribery;
          $scope.prize=data.data.prize;
          if($scope.bribery==0&&$scope.prize==0){
            $scope.nonePrize=0;
          }else {
            $scope.nonePrize=1;
          }
        });

      };
      $scope.shareToFriend=function() {
        if(MobileService.isMobile.AppVersion().isUseable){
          //若红包剩余数量为0，提示红包已发完
          if($scope.leftnum==0){
            UtilService.messager.dialog(1,[{"txt":"确定","callback":function(){$rootScope.dialogHandler()}}],{title:"提示", msg:"来晚了一步，红包已发完啦"},function(){},"textCenter");
          }else{
            MobileService.shareConfig.shareInfo.showDialog = 1;
            window.xdm.callShare(JSON.stringify(MobileService.shareConfig.changeShareInfo("resultShareInfo")),function(d){
              UtilService.messager.dialog(1,[{"txt":"知道啦","callback":function(){}}],{title:"邀请成功", msg:"待好友成功下载并登录小豆苗后可在“我的-我的红包”领取红包"});
              _czc.push(['_trackEvent','红包首页','分享次数','分享给好友']);
            });
          }
        }else{
          UtilService.messager.dialog(1, [{
            "txt": "更新", "callback": function () {
              window.location.href="http://t.cn/RJqkveu";
            }}], {title: "提示", msg: "参加活动请先更新到最新版本，才能顺利领取红包哦~"},function () {},"textCenter");
        }

      }

}]);



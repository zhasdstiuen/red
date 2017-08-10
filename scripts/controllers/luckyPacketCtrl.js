/**
 * Created by lenovo on 2017/1/11.
 */
angular.module('redApp')
  .controller('luckyPacketCtrl',['$scope','$rootScope','$state','UtilService','WxService','HttpService',function ($scope,$rootScope,$state,UtilService,WxService,HttpService) {


    //获取活动状态
    HttpService.httpRequest('user', 'getActivityStatus', {})
      .then(function(data) {
        if(data.data){
          UtilService.messager.tip(data.errorMsg,false);
        }
      })

    $scope.checkPacket = function(){
      HttpService.httpRequest('lead', 'briberyH5Left', {})
        .then(function(data){
          if(data.data.leftNumber > 0){
            $state.go('luckyPacket.register');
          }else{
            UtilService.messager.dialog(1,[{"txt":"确定","callback":function(){$rootScope.dialogHandler()}}],{title:"提示", msg:"来晚了一步，红包已发完啦"},function(){},"textCenter");
          }

        });
    }

}]);

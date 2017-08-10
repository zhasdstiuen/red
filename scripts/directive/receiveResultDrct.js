/**
 * Created by lenovo on 2017/1/16.
 */
angular.module("redApp").directive('receiveResultDrct', ['$rootScope','UtilService','$location',function ($rootScope,UtilService) {
  return {
    restrict: 'AE',
    link: function ($scope, $e, $attr) {


      $scope.callPhone = function(){
        UtilService.messager.dialog(1,[{"txt":"取消","callback":function(){$rootScope.dialogHandler()}},{"txt":"呼叫","callback":function(){window.location.href = "tel:4008304188";}}],{title:"小豆苗客服热线", msg:"4008304188"},function(){},"textCenter");
      }

      $scope.callWxShare = function(){
        UtilService.messager.showShareTip();
      }


    }
  }
}]);

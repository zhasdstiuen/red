/**
 * Created by lenovo on 2017/1/13.
 */
angular.module("redApp").directive('connectDrct', ['$rootScope','WxService',function ($rootScope,WxService) {
  return {
    restrict: 'AE',
    link: function ($scope, $e, $attr) {

      $scope.btn_clickable = false;
      $scope.connectFormInfo = {
        regionId:"",
        relation:"",
        birthday:"",
        childNo:'',
        reserveMobile:'',
        agreeState:true
      }
      //监听值的变化，修改查询按钮状态
      $scope.$watch('connectFormInfo',function(newVal, oldVal, $scope){
        chekForm(newVal);
      }, true);

      $scope.$watch('connectWay',function(newVal, oldVal, $scope){
        $scope.$watch('connectFormInfo',function(newVal, oldVal, $scope){
          chekForm(newVal);
        }, true);
      }, true);

      function chekForm(newVal){
        if(!newVal.regionId || !newVal.relation || !newVal.birthday || !newVal.agreeState){
          $scope.btn_clickable = false;
          return;
        }
        if($scope.useChildNo){//儿童编码关联
          if(!newVal.childNo){
            $scope.btn_clickable = false;
            return;
          }
        }else{ //手机号码关联
          if(!(/^1[3|4|5|7|8]\d{9}$/.test(newVal.reserveMobile))){
            $scope.btn_clickable = false;
            return;
          }
        }
        $scope.btn_clickable = true;
      }


      $scope.changeConnectWay = function(){
        $scope.useChildNo = !$scope.useChildNo;
        if($scope.useChildNo)$scope.connectWay = "用手机号同步";
        else $scope.connectWay = "用编码或条码同步";
      }

      /*
       * 微信扫码
       */
      $scope.wxScanQRCode = function(){
        WxService.scanQRCode(function(res){
          var code = res.resultStr;
          $scope.$apply(function(){
            $scope.connectFormInfo.childNo = code.substr(code.indexOf(",")+1);
          })
        })
      }

      /*$("#date").on("click",function(){
         if($(this).val().length>0){
          $(this).addClass("full");
         }
         else{
          $(this).removeClass("full");
         }
       });*/

      //兼容安卓机输入框出现时页面缩短，页面重叠现象
      $("input[type='tel']").focus(function(){
        $("#m-footer2").hide();
      })
      $("input[type='tel']").blur(function(){
        $("#m-footer2").show();
      })




    }
  }
}]);

/**
 * Created by qiangxl on 2017/1/9.
 */
angular.module("redApp").directive('lotteryDrct',['$state','HttpService','UtilService',function($state,HttpService,UtilService){
  return{
    restrict:'AE',
    link:function ($scope) {

      $scope.KinerLottery = new window.KinerLottery({
        rotateNum: 3, //转盘转动圈数
        body: ".u-zpBox", //大转盘整体的选择符或zepto对象
        direction: 0, //0为顺时针转动,1为逆时针转动
        disabledHandler: function(key) {
          switch (key) {
            case "noStart":
              alert("活动尚未开始");
              break;
            case "completed":
              alert("活动已结束");
              break;
          }
        }, //禁止抽奖时回调
        clickCallback: function() {

        }, //点击抽奖按钮,再次回调中实现访问后台获取抽奖结果,拿到抽奖结果后显示抽奖画面
        KinerLotteryHandler: function(deg) {
          var prizeMsg='';
          if($scope.prizeType==1){
            $scope.getPrizeCallback=function (){window.location.href="yeemiao://activity/myreward"};
            prizeMsg="获得现金红包"+$scope.money+"元";
          }
          else if($scope.prizeType==2){
            $scope.getPrizeCallback=function(){$state.go("drawPage.priceInfo",{prizeId:$scope.prizeId})};
            switch ($scope.prizeLevel){
              case 1:
                prizeMsg="获得一等奖&nbsp ipad mini2";
                break;
              case 2:
                prizeMsg="获得二等奖&nbsp宝宝辅食搅拌机";
                break;
              case 3:
                prizeMsg="获得三等奖&nbsp宝宝辅食电炖锅";
                break;
            }
          }
          UtilService.messager.dialog(1, [{
            "txt":"继续抽奖", "callback":function(){}},{"txt":"领取奖品","callback":$scope.getPrizeCallback}], {title:"恭喜你", msg:prizeMsg},function(){},"textCenter");


        } //抽奖结束回调
      });





    }
  }
}]);

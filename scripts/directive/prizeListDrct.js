/**
 * Created by qiangxl on 2017/1/12.
 */
angular.module("redApp").directive('prizeListDrct',['$interval',function($interval){
  return{
    restrict:'AE',
    link:function ($scope) {
      var top=0;
      // var secondTop=0.4;
      var timer=$interval(function(){
        top-=.005;
        if(top<=-.4){
          top=0;
          var first=$scope.showBriberryList.shift();
          $scope.showBriberryList.push(first);
        }
        var secondTop=top;
        $("#prizeList li").css("top",top+"rem");
      },20)

    }
  }
}]);
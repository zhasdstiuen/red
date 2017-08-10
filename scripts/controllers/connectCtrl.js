angular.module('redApp')
  .controller('connectCtrl',['$scope','$rootScope', '$timeout','HttpService','UtilService','$state',function ($scope,$rootScope,$timeout, HttpService,UtilService,$state) {

    $scope.useChildNo =true;
    $scope.connectWay = "用手机号同步";
    $scope.regionAddress = "请输入接种点所在地";


    //显示城市选择器
    $scope.showRegion = function(){
      $rootScope.currentRegion="province";
    }


    //判断是否对接地区
    $scope.isDockRegion = function(id){
      $scope.connectFormInfo.regionId = id;
      HttpService.httpRequest('user', 'isDockRegion', {regionId:id})
        .then(function(data){
          if(!data.data){
            UtilService.messager.dialog(1,[{"txt":"邀请好友赚红包","callback":function(){
              if($rootScope.ending=="wx"){
                UtilService.messager.showShareTip();
              }else{
                window.location.href = "http://t.cn/RJqkveu";
              }
            }}],{title:"领取失败", msg:"很抱歉，该地区不在本次活动范围内，您不符合新人红包的领取条件哦！快去邀请好友赚取红包吧！"});
          }
        });
    }


    //关联宝宝
    $scope.connectBaby = function(){
      if($scope.btn_clickable) {
        //ng-model的坑,ng-model取到的input[type=date]的值格式为 Sat Feb 04 2017 00:00:00 GMT+0800 (中国标准时间)
        //接口要求日期格式为“2017-01-01”，需补0；
        var birthday = new Date($scope.connectFormInfo.birthday);
        var month = ((birthday.getMonth()+1)<10) ? '0'+ (birthday.getMonth()+1):(birthday.getMonth()+1);
        var day = birthday.getDate()<10 ? '0'+birthday.getDate():birthday.getDate();
        birthday = birthday.getFullYear()+"-"+month+"-"+day;
        var params = {
          relation: $scope.connectFormInfo.relation,
          childNo: $scope.connectFormInfo.childNo,
          birthday: birthday,
          mobile:$scope.connectFormInfo.reserveMobile,  //建档手机号码
          userId:$scope.userId,
          token:  $scope.token,
          regionId:$scope.connectFormInfo.regionId
        }
      }
      HttpService.httpRequest('user', 'relateChildren', params)
        .then(function(data){
          $rootScope.failText = data.errorMsg;
          $timeout(function(){
            if(data.data)$state.go('success', null, {location:'replace'});
            else $state.go('fail');
          });
        });
    }





  }])

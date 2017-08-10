'use strict';

/**
 * @ngdoc overview
 * @name redApp
 * @description
 * # redApp
 *
 * Main module of the application.
 */

var redApp = angular.module('redApp', [
  'ui.router'
])
  .config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/index');
    $stateProvider
      .state('app', {
        url:'/index',
        templateUrl:'views/indexPage.html',
        controller:'indexCtrl'
      })
      .state('luckyPacket', {
        url:'/luckyPacket',
        templateUrl:'views/luckyPacket.html',
        controller:'luckyPacketCtrl'
      })
      .state('activityRule',{
        url:'/activityRule',
        templateUrl:'views/activityRule.html'
      })
      .state('app.activityRule',{
        url:'/activityRule',
        templateUrl:'views/activityRule.html'
      })
      .state('drawPage',{
        url:'/drawPage',
        templateUrl:'views/drawPage.html',
        controller:'DrawCtrl'
      })
      .state('success',{
        url:'/getSuccess',
        templateUrl:'views/getSuccess.html'
      })
      .state('fail',{
        url:'/getFail',
        templateUrl:'views/getFail.html'
      })
      .state('luckyPacket.register',{
        url:'/register',
        templateUrl:'views/register.html',
        controller:'registerCtrl'
      })
      .state('luckyPacket.register.userAgreement',{
        url:'/userAgreement',
        templateUrl:'views/userAgreement.html'
      })
      .state('luckyPacket.register.password',{
        url:'/password',
        templateUrl:'views/password.html',
        controller:'passwordCtrl'
      })
      .state('luckyPacket.register.password.connect',{
        url:'/connect',
        templateUrl:'views/connect.html',
        controller:'connectCtrl'
      })
      .state('drawPage.priceInfo',{
        url:'/priceInfo/:prizeId',
        templateUrl:'views/priceInfo.html',
        controller:'PrizeInfoCtrl'
      });

  }])
  .run(['$rootScope', '$timeout', '$state','$interval','$location','MobileService','UtilService', 'WxService','HttpService','EnumSet',function($rootScope, $timeout, $state,$interval,$location,MobileService,UtilService,WxService,HttpService,EnumSet){

    //判断终端类型
    if(!MobileService.isMobile.any()){
      UtilService.messager.tip("请在手机端打开本页面哦~",false);
    }else if(MobileService.isMobile.XDM()){
      $rootScope.ending = "xdm";
    }else if(MobileService.isMobile.Weixin()){
      $rootScope.ending = "wx";
    }else{
      $rootScope.ending = "other";
    }

    if($rootScope.ending == "xdm"){
      window.xdm.setTitleBar(JSON.stringify({title:'邀请好友，各得现金红包',color:'#1f1f29'}), function(data){});
      //获取活动状态
      HttpService.httpRequest('user', 'getActivityStatus', {})
        .then(function(data) {
          //判断活动是否结束
          if(data.data){
            $("#init_mask").remove();
            UtilService.messager.tip(data.errorMsg,false);
          }else{
            //判断是否是最新版本
            if(MobileService.isMobile.AppVersion().isUseable){
              // var timer=$interval(function () {
                // 调用APP接口获取token
                window.xdm.getUserInfo('', function(data){
                  $("#init_mask").remove();
                  data = JSON.parse(data);
                  //如果token为空再次请求
                  if(!data.token){
                    window.xdm.getUserInfo('', function(data){$rootScope.token= data.token;});
                  }
                  else{
                    $rootScope.token= data.token;
                  }
                  $rootScope.userId=data.userId;
                  $rootScope.nickName=data.nickName;
                  if(!(/^1[3|4|5|7|8]\d{9}$/.test($rootScope.nickName))){
                    $rootScope.nickName = $rootScope.nickName.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3");
                  }
                  $rootScope.$broadcast("getUserInfoOk");
                  // $interval.cancel(timer);
                });
              // },300,10);
              // timer.then(function(){
              //   if(!$rootScope.token){
              //     UtilService.messager.tip("获取用户信息失败，请退出重试~",false);
              //   }
              // });
            }else {
              UtilService.messager.dialog(1, [{
                "txt": "更新", "callback": function () {
                  window.location.href="http://t.cn/RJqkveu";
                }}], {title: "提示", msg: "参加活动请先更新到最新版本，才能顺利领取红包哦~"},function () {},"textCenter");
            }
          }
        });
    }

    //非小豆苗app打开
    if($rootScope.ending != "xdm"){
      var urlParams = UtilService.getUrlParams(["inviteCode","nickName"]);
      if(urlParams.inviteCode){
        var inviteCode = urlParams.inviteCode;    //邀请码
        if(inviteCode){
          $rootScope.inviteCode = inviteCode;
        }
        var nickName = decodeURIComponent(decodeURIComponent(urlParams.nickName));  //用户昵称
        if(nickName){
          $rootScope.nickName = nickName;
          if(nickName=="undefind"){
            $rootScope.nickName ="";
          }
        }
        $("#init_mask").remove();
        if($rootScope.ending=="wx"){
          WxService.wxShare(2,"resultShareInfo");
        }
      }else{
        $("#init_mask").remove();
        UtilService.messager.tip("获取邀请信息失败，请退出重试！",false);
      }
      // $location.path('/luckyPacket');  //由于非微信打开注册页面都没有配置分享信息，分享出来的页面不一定是首页，故统一处理入口页面非首页统一跳到首页。
    }


    $rootScope.$on('$stateChangeStart', function(event, toState, params, fromState, fromParams){
      //红包领取成功或失败页面，用户按返回键退出页面
      if($state.current.name=='success'|| $state.current.name=='fail'){
        if(toState.name!="activityRule"){
          event.preventDefault();
        }
      }
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, params, fromState, fromParams){

      $rootScope.prevState = fromState;
      $rootScope.$state = $state;
      var state = $state.current.name;
      if($rootScope.ending != "xdm"){
        if($rootScope.inviteCode && $rootScope.nickName ){
          $location.search({inviteCode:$rootScope.inviteCode,nickName:$rootScope.nickName})
        }
      }
      $rootScope.title ="邀请好友，各得现金红包";
      // $timeout(function(){
      //   switch(state) {
      //     case 'luckyPacket.register':
      //       $rootScope.updateTitle("注册");
      //       break; 
      //     case 'luckyPacket.register.password':
      //       $rootScope.updateTitle("设置密码");
      //       break;
      //     case 'luckyPacket.register.password.connect':
      //       $rootScope.updateTitle("同步宝宝信息");
      //       break;
      //     default:
      //       $rootScope.updateTitle("邀请好友，各得现金红包");
      //       break;
      //   }
      // });

      // pageStatistics(EnumSet.statistics[state]);
    })

  }]);


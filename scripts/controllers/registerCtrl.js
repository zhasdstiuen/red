/**
 * Created by qiangxl on 2017/1/6.
 */
angular.module('redApp')
  .controller('registerCtrl',['$scope','$rootScope','$location','HttpService','UtilService', '$interval','$state','WxService','$timeout',function ($scope,$rootScope,$location,HttpService,UtilService,$interval,$state,WxService,$timeout) {

    $location.search({inviteCode:$rootScope.inviteCode,nickName:$rootScope.nickName});
    $scope.timeCount = false;        //倒计时是否在进行
    $scope.telOk = false;
    $scope.codeBtnText="获取验证码";
    $scope.isGetCode = false;

    /*function showTimeout(time){
      if(time == 0){
        $timeout(function(){
          $scope.codeBtnText="获取验证码";
        },1)
        $scope.timeCount=false;
      }else{
        time = time-1;
        $timeout(function(){
          $scope.codeBtnText=time+"s";
        },1)
        /!*$scope.$apply(function(){
          $scope.codeBtnText=time+"s";
        })*!/
        setTimeout(function(){
          showTimeout(time);
        },1000)
      }
    }*/

    /*
     * 验证手机号码是否合法
     */
    $scope.checkTel = function(){
      if(!(/^1[3|4|5|7|8]\d{9}$/.test($scope.telNum))){
        $scope.telOk = false;
      }else{
        $scope.telOk = true;
      }
    }

    /*
     * 获取验证码
     */
    $scope.getCode = function(){
      $scope.isGetCode = true;
      if(!$scope.timeCount && $scope.telOk){
        HttpService.httpRequest('user', 'checkRegister', {"mobile":$scope.telNum})
          .then(function(data){
            var isRegister = data.data.isRegister;       //用户是否注册过
            var flag = data.data.flag;                   //是否通过活动注册过
            $scope.flag = flag;
            $scope.isRegister = isRegister;
            if(data.data.vcodeToken){
              $scope.vcodeToken = data.data.vcodeToken;  //若isRegister为false，则返回vcodeToken，为验证token
            }
            if(isRegister && !flag){   //用户是小豆苗的老用户
              UtilService.messager.dialog(1,[{"txt":"去登录","callback":function(){window.location.href="http://t.cn/RJqkveu"}}],{title:"提示", msg:"您已经是小豆苗的用户啦~赶紧登录小豆苗邀请好友领红包吧~！"});
            }else{
              var time = 60;
              $scope.codeBtnText=time+"s";
              $scope.timeCount=true;
              var timer = $interval(function(){
                time-=1;
                if(time==0){
                  $scope.codeBtnText="获取验证码";
                  $interval.cancel(timer);
                  $scope.timeCount=false;
                  return;
                }
                $scope.codeBtnText=time+"s";
              },1000);
             /* setTimeout(function(){
                showTimeout(time);
              },1000)*/
            }

          });
      }
    }



    /*
     *验证验证码
     */
    $scope.toValidateCode = function(){
      if( $scope.telOk && $scope.isGetCode && $scope.checkCode!=''&& $scope.checkCode!=undefined){
        var params ={
          mobile:$scope.telNum,
          vcode:$scope.checkCode,
          flag:$scope.flag,
          vcodeToken:$scope.vcodeToken
        }
        HttpService.httpRequest('user', 'userAuth', params)
          .then(function(data){
            $scope.userId = data.data.userId;
            $scope.registerToken = data.data.registerToken;   //注册验证码
            $scope.token = data.data.token;
            //用户通过活动注册成功但是未关联儿童
            if($scope.isRegister && $scope.flag){
              $rootScope.nickName = $scope.telNum.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3");  //用户通过活动注册成功用户昵称默认为手机号码，中间四位打码
              if($rootScope.ending=="wx"){
                WxService.wxShare(2,"resultShareInfo");
              }
              UtilService.messager.dialog(1,[{"txt":"同步宝宝信息","callback":function(){$state.go('luckyPacket.register.password.connect')}}],{title:"提示", msg:"你之前已经注册过啦~请前往同步宝宝信息吧~！"});
            }else if(!$scope.isRegister){
              $state.go('luckyPacket.register.password');
            }
          });

      }
    }

    //兼容安卓机输入框出现时页面缩短，页面重叠现象
    $("input").focus(function(){
      $("#m-footer").hide();
    })
    $("input").blur(function(){
      $("#m-footer").show();
    })

  }]);



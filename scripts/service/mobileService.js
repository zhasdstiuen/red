/**
 * Created by charlie on 2016/5/9.
 */
angular.module('redApp').factory('MobileService', ['$rootScope','EnumSet',function($rootScope,EnumSet){
  var self = this;

  /**
   * 终端类型
   */
  self.isMobile = {
    XDM:function(){return navigator.userAgent.match(/xdm/i) ? true : false;},
    //AppAndroid:function(){return navigator.userAgent.match(/android/i) ? true : false},
    Android: function(){return navigator.userAgent.match(/Android|Linux/i) ? true : false},
    BlackBerry: function(){return navigator.userAgent.match(/BlackBerry/i) ? true : false},
    IOS: function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false},
    Windows: function(){return navigator.userAgent.match(/IEMobile/i) ? true : false},
    any: function(){return (self.isMobile.Android() || self.isMobile.BlackBerry() || self.isMobile.IOS() || self.isMobile.Windows() || self.isMobile.XDM())},
    Weixin:function(){
      var ua = navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i)=="micromessenger")return true;
      else return false;
    },
    QQ:function(){
      if (navigator.userAgent.match(/MQQBrowser/i) )return false;
      return navigator.userAgent.match(/QQ/i) ? true : false;
    },
    Android23:function(){return navigator.userAgent.match(/Android 2.3/i) ? true : false},
    /**
     * app版本号
     *  @params: useableVersion  对象
     *            例如： {ios:2016121600;android:48}
     *  @return  {appBuild:2016121600/48;isUseable:true}
     *
     */
    AppVersion :function(useableVersion){
      var ua = navigator.userAgent;
      var appInfoArr = ua.split(';');
      var result = {};
      for(var i in appInfoArr){
        var appInfo = appInfoArr[i].split("/");
        if(appInfo[0] == 'appBuild'){
          var lastOldBuild = 2017021300;
          if(useableVersion)lastOldBuild = useableVersion.ios;
          if(self.isMobile.Android()){
            lastOldBuild = 50;
            if(useableVersion)lastOldBuild = useableVersion.android;
          }
          result.appBuild = appInfo[1];


          //判断app build日期
          if(appInfo[1]>=lastOldBuild){
            result.isUseable = true;
          }else{
            result.isUseable = false;
          }
          break;
        }
      }
      return result;
      sessionStorage
    }
  };

  /**
   * app分享信息
   *  @shareInfo 一般的分享信息
   *  @editableInfo 特性页面的可修改分享信息，
   *  @changeShareInfo  修改分享信息
   *    @params: msgKey  分享信息的key('editableInfo'....)
   */
  self.shareConfig = {
    shareInfo:{
      'title':'点开即获5元红包，还有宝宝健康福袋等你拿~',
      'desc':'内含现金红包、育儿课程、儿科专家咨询，限量一万份，先到先得！',
      'link':EnumSet.appInfo.appUrl + 'app.html',
      'imgUrl': EnumSet.appInfo.appLogo,
      'type':'link',
      'success':function(){
      },
      'cancel':function(){}
    },
    resultShareInfo:function() {
      return {
        'title': '点开即获5元红包，还有宝宝健康福袋等你拿~',
        'desc': '内含现金红包、育儿课程、儿科专家咨询，限量一万份，先到先得！',
        'link':EnumSet.appInfo.appUrl + 'app.html#/luckyPacket?inviteCode='+$rootScope.inviteCode+'&nickName=' + encodeURIComponent($rootScope.nickName),
        'imgUrl':EnumSet.appInfo.appLogo,
      }
    },
    changeShareInfo:function(msgKey){
      var result = {};
      if(Object.assign){
        result=Object.assign({},this.shareInfo, this[msgKey]())
      }else{
        result=$.extend({},this.shareInfo, this[msgKey]())
      }
      return result;
    }
  };
  return self;
}]);

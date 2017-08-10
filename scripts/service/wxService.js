/**
 * 微信api配置
 */
redApp.factory('WxService', ["UtilService", 'HttpService', 'MobileService','$rootScope','EnumSet', function( UtilService, HttpService, MobileService, $rootScope,  EnumSet ){
  var self = this;
  self.wxConfig = function(){
    var callWeixinApi, shareTimeline, shareAppMessage,shareQQ,shareWeibo,shareQZone,closeWindow;
    /**
     * 请求配置信息
     */
      // $.when(
      //   $.ajax({
      //     type: "POST",
      //     url:EnumSet.serverApi.baseUrl+EnumSet.serverApi.apiUrl.wechat.config,
      //     dataType: "json",
      //     beforeSend: function () {
      //     },
      //     complete: function () {
      //     }
      //   })
      // ).done(function(data) {
      //     callWeixinApi(data);
      //   }).fail(function () {
      //     UtilService.messager.tip("获取微信接口地址错误！")
      //   })

      /*HttpService.httpRequest('wxConfig', {}, callWeixinApi, function(){UtilService.messager.tip('获取接口配置信息失败，部分功能可能暂时无法使用！')});*/

    callWeixinApi = function (data){
        if (data) {
          wx.config({
            debug: false,
            appId: data.appid,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['checkJsApi', 'closeWindow','chooseImage','previewImage','uploadImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'hideAllNonBaseMenuItem', 'hideMenuItems', 'showMenuItems',
            'onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone','scanQRCode']
          });
          wx.ready(function () {
            //wx.hideAllNonBaseMenuItem();//隐藏非基础类接口
            //只能分享到朋友圈和好友
            wx.showMenuItems({
              menuList: [
                'menuItem:share:appMessage', // 分享给朋友
                'menuItem:share:timeline', // 分享到朋友圈
                'menuItem:share:weiboApp',
                'menuItem:share:qq',
                'menuItem:share:QZone '
              ]
            });
            //wx.chooseImage();
            //wx.uploadImage();
            self.wxShare(2,"resultShareInfo");
            //$rootScope.$broadcast("wxready");
            //self.viewImg();
          });
          wx.error(function (res) {
            alert("wx.error："+res.errMsg);
            UtilService.messager.tip("获取接口配置信息失败，部分功能可能暂时无法使用！");
          })
        } else {
          UtilService.messager.tip("微信接口配置信息错误，请尝试刷新页面");
        }

      },
      closeWindow = function () {
        wx.closeWindow()
      },
      shareTimeline = function (data) {
        wx.onMenuShareTimeline( data)
      },
      shareAppMessage = function (data) {
        wx.onMenuShareAppMessage( data)
      },
      shareQQ = function(data){
        wx.onMenuShareQQ(data);
      },
      shareWeibo = function(data){
        wx.onMenuShareWeibo(data);
      },
        shareQZone = function(data){
          wx.onMenuShareQZone(data)
        }

    /*
      扫一扫接口
     */
      self.scanQRCode = function (callback) {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            setTimeout(function(){
              callback(res); //当needResult 为 1 时，res.resultStr为扫码返回的结果
            },100)
          }
        });
      },

    /*self.viewImg = function(i){
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [] // 需要预览的图片http链接列表
      });
    };*/
    /**
     * 配置分享信息
     * @param type  1:默认的分享信息  2:特定页面的分享信息
     *  **路由发生变化需要修改分享信息时调用WxService.wxShare(type);
     */
    self.wxShare=function( type, router ){
      type = type || 1;
      var shareInfo = (type === 1 ? MobileService.shareConfig.shareInfo() : MobileService.shareConfig.changeShareInfo(router) );
      shareTimeline(shareInfo);
      shareAppMessage(shareInfo);
      shareQQ(shareInfo);
      shareWeibo(shareInfo);
      shareQZone(shareInfo);
    }

  };
  if(MobileService.isMobile.Weixin()){
    self.wxConfig();
  }
  return self;
}]);

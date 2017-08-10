/**
 * Created by charlie on 2016/4/27.
 * 定义常量
 */
angular.module('redApp').value("EnumSet", {

'serverApi':{
   'baseUrl':'data',//jk
   'apiUrl':{
   /*********     首页       *********/
   "indexPage":{
   "briberyLeft":"/lead/briberyLeft.json",
   "briberyTotal":"/lead/briberyTotal.json"
   },
   /*********    抽奖页      *********/
   "drawPage":{
   "showBriberryList":"/lead/showBriberryList.json",
   "lottery":"/drawPage/lottery.json",
   "lotteryBriberry":"/drawPage/lotteryBriberry.json",
   "submitInfo":"/drawPage/getPrize.json"                                                  //填写中奖信息后提交
   },
   /*********  用户信息相关   *********/
   "user":{
   "checkRegister":"/user/checkRegister.json",                                            //获取验证码并判断用户手机号码是否已被注册
   "userAuth":"/user/userAuth.json",
   "registerUser":"/user/registerUser.json",
   "isDockRegion":"/user/isDockRegion.json",
   "relateChildren":"/user/relateChildren.json",
   "getActivityStatus":"/user/getActivityStatus.json"
   },

    /*********  红包信息相关   *********/
   "lead":{
      "briberyH5Left":"/lead/briberyH5Left.json"
    },

   /********    微信配置信息    ********/
   "wechat":{
   "config":      '/wxWebActivityController/getWxClientCredentialInfo.json?'+(new Date).getTime()                    //微信接口配置信息
   }
   }
   },

  // 'serverApi':{
  //   'baseUrl':window.location.protocol+'//'+ (window.location.host) + '/lead',
  //   'apiUrl':{
  //     /*********     首页       *********/
  //     "indexPage":{
  //       "briberyLeft":"/lead/briberyLeft.action",
  //       "briberyTotal":"/lead/briberyTotal.action"
  //     },
  //     /*********    抽奖页      *********/
  //     "drawPage":{
  //       "showBriberryList":"/lead/showBriberryList.action",
  //       "lottery":"/lead/lottery.action",
  //       "lotteryBriberry":"/lead/lotteryBriberry.action",
  //       "submitInfo":"/lead/getPrize.action"                                                  //填写中奖信息后提交
  //     },
  //     /*********  用户信息相关   *********/
  //     "user":{
  //       "checkRegister":"/user/checkRegister.action",                                            //获取验证码并判断用户手机号码是否已被注册
  //       "userAuth":"/user/userAuth.action",
  //       "registerUser":"/user/registerUser.action",
  //       "isDockRegion":"/user/isDockRegion.action",
  //       "relateChildren":"/user/relateChildren.action",
  //       "getActivityStatus":"/user/getActivityStatus.action"
  //     },

  //     /*********  红包信息相关   *********/
  //     "lead":{
  //     "briberyH5Left":"/lead/briberyH5Left.action"
  //   },

  //   /********    微信配置信息    ********/
  //   "wechat":{
  //     "config":      '/wxWebActivityController/getWxClientCredentialInfo.action?'+(new Date).getTime()                    //微信接口配置信息
  //   }
  // }
  // },

  'httpCode':{
    '401': '访问未授权',
    '403': '访问被拒绝',
    '404': '请求地址有误',
    '405': '访问被拒绝(405)',
    '500': '服务器发生错误,请稍后再试',
    '502': '网关错误',
    '503': '服务不可用',
    '504': '网关超时',
    '505': '不支持所请求http协议版本',
    '-1': '请求失败,请检查您的网络设置'
  },

  //页面统计
  'statistics':{
    //非app部分
    'luckyPacket':["分享页首页",'统计浏览量'],
    'success':["领取成功",'统计浏览量'],
    'fail':["领取失败",'统计浏览量'],
    'luckyPacket.register':["注册",'统计浏览量'],
    'luckyPacket.register.userAgreement':["用户协议",'统计浏览量'],
    'luckyPacket.register.password':["设置密码",'统计浏览量'],

    //app部分
    'app':["红包首页",'统计浏览量'],
    'drawPage':["抽奖页",'统计浏览量'],
    'drawPage.priceInfo':["填写收货地址",'统计浏览量'],

    //共用页面
    'activityRule':["活动规则",'统计浏览量'],

  },



  //活动地址相关信息
  'appInfo':{
    'appUrl': window.location.protocol+'//'+ (window.location.host) + '/lead/',
    /*'appHost': 'http://'+ (window.location.host),
     'appAbsUrl': 'http://'+ (window.location.host)+'/wechat/app.html',*/
    'appLogo': window.location.protocol+'//'+ (window.location.host) + '/lead/images/share_ico.png'
    //'appLogo':"http://test.zjs.mianyee.cn/wechat/images/logo.png"
  }


});


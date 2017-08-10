  /**
 * Created by charlie on 2016/4/29.
 *  通用工具类
 */
redApp.factory("UtilService", ['$rootScope', '$location', '$sce', '$timeout', '$injector',  function($rootScope, $location, $sce, $timeout, $injector){
  var self = this;
  /**
   * getUrlParams : 获取url参数
   * @param keys : 键（字符串/数组）
   * @return params : 值（字符串/数组）
   */

  self.getUrlParams = function(keys){
    if(!keys)return null;
    var url = $location.absUrl();
    var index = url.indexOf('?');
    if( index < 0 )return null;
    var paramsArr = url.substr(index+1).split(/[&;?]/);
    var params = {};
    try {
      for (var i in paramsArr) {
        var arr = paramsArr[i].split('=');
        params[arr[0]] = arr[1];
      }
      if (!Array.isArray(keys)) {
        params = params[keys];
      }
      return params;
    }catch(e){
      console.log("url解析错误",e);
    }
  };

  /**
   * 获取cookie
   * cookie中包含 token
   *              userId
   *              type            加入疾控状态 0-未加入 1-待审核 2-审核通过 3-驳回
   *              isToRegister    是否需要进入注册流程0-否 1-是
   */
  self.getCookie = function(c_name){
    if (document.cookie.length>0)
    {
      var c_start=document.cookie.indexOf(c_name + "=")
      if (c_start!=-1)
      {
        c_start=c_start + c_name.length+1;
        var c_end=document.cookie.indexOf(";",c_start)
        if (c_end==-1) c_end=document.cookie.length
        return unescape(document.cookie.substring(c_start,c_end))
      }
    }
    return ""
  };
  /**
   * 删除cookie
   */
  self.removeCookie=function(c_name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=self.getCookie(c_name);
    if(cval!=null) document.cookie= c_name + "="+cval+";expires="+exp.toGMTString();
  };
  /**
   * getAge:计算年龄
   * @param birthday  出生日期
   * @returns {string} 年龄（x岁x个月x天）
   */
  self.getAge = function(birthday){
    return '';
  }


  /**
   * catchException:全局异常捕捉
   * @type {Function}
   */
  self.catchException = (function(){
    window.onerror = function(message, url, line) {
      message = message || arguments[0];
      url = url || "";
      line = line || 0;
      Logger.log({
        msg : message,
        url : url,
        line : line,
        type : "onerror"
      });
      return true;
    };
    var Logger = {
      toQueryString: function (o) {
        var res = [];
        for (var p in o) {
          if (o.hasOwnProperty(p)) {
            res.push(escape(p) + "=" + escape(o[p]));
          }
        }
        return res.join("&");
      },
      log: function (info) {
        if (info == null) {
          return;
        }
        try {
          var img = new Image();
          //img.src = self.baseUrl + "/scriptErr.do?" + Logger.toQueryString(info);//'日志记录'接口
        } catch (ex) {
        }
      },
      logByError: function (error) {
        var info = {};
        info.msg = error.message || "";
        if (error.stack) {
          info.line = error.lineNumber || 0;
          info.url = error.fileName || "";
          info.stack = error.stack;
        } else {
          info.number = error.number || 0;
        }
        info.type = "try-catch";
        Logger.log(info);
      },
      runMethod: function (method) {
        try {
          method();
        } catch (ex) {
          Logger.logByError(ex);
        }
      }
    }
  })();

  /**
   * 表单验证
   */
  self.formValidate = function($_form, $scope){
    var arr = $_form.serializeArray();
    var info = {};
    var result = true;
    arr.every(function(e, i, arr){
      var $e = $("#"+ e.name);
      var data_rule = $e.attr('data-rule');
      if(data_rule) {
        var val = $e.val();
        data_rule = JSON.parse(data_rule);
        if (data_rule.type == 'tel' && !val.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)){
          self.messager.tip(data_rule.errMsg);
          return (result = false);
        }
        if (data_rule.required && ($.trim(val) == '' || val == null || val == undefined )) {
          self.messager.tip(data_rule.errMsg);
          return (result = false);
        }
        if (data_rule.minLength && data_rule.minLength > val.length) {
          self.messager.tip(data_rule.errMsg);
          return (result = false);
        }
        if (data_rule.maxLength && data_rule.maxLength < val.length) {
          self.messager.tip(data_rule.errMsg);
          return (result = false);
        }
        if (data_rule.int && (val < 0 || (val % 1) != 0)) {
          self.messager.tip(data_rule.errMsg);
          result = false;
          return false;
        }
        if (data_rule.max && data_rule.max < val) {
          self.messager.tip(data_rule.errMsg);
          result = false;
          return false;
        }
        //info[e.name] = filterTag(val);html标签过滤
        info[e.name] = val;
      }
      return true;
    })
    $scope.params = info;
    return result;
  };

  /**
   * 消息框
   *  @method
   *    #mask : 遮罩
   *    #tip : 消息提示(默认自动隐藏)
   *        @params
   *          msg:消息内容
   *
   *    #dialog: 对话框
   *        @param type: 类型(alert:1 / confirm:2)
   *        @param  btn:  [{"txt":"确定","callback":function(){}}] 对话框按钮文字(数组，单个按钮/两个按钮)
   *        @param  msg: {title:"", msg:""}  对话框标题和消息内容，title不传默认为“提示”
   *        @callback callback:对话框渲染完成后执行的回调
   *           *
   *    #hideMessager:  隐藏消息框
   */
  self.messager = {
    mask:function(){
      if(!$rootScope.messager)$rootScope.messager=new Object();
      if(!this.$mask){
        this.$mask=($('<div id="msg_mask" class="mask" ng-class="{true:\'black-bg\'}[black_bg==1]" ng-show="messager.showMask==1"><i class="v_m"></i><div id="tip" class="msg" ng-class="{true:\'success\'}[success_tip]" ng-show="messager.showTip==1"><span ng-bind="messager.msg"></span></div><div id="dialog" class="msg dialoger" ng-show="messager.showDialog==1"><i class="dialoger_close" ng-click="dialogHandler()"></i></div></div>').appendTo('#page'));
        $injector.get('$compile')(this.$mask)($rootScope);//重新编译动态插入的dom，注入作用域
      }
      $rootScope.messager.showMask=1;
    },
    tip:function(msg, autohide, callback){
      this.mask();
      $rootScope.black_bg=0;
      $rootScope.messager.msg = msg;
      $rootScope.messager.showTip=1;
      $rootScope.messager.msg = msg;
      if(this.timer)$timeout.cancel(this.timer);
      if(autohide!==false){
        this.timer = $timeout(function(){
          self.messager.hideMessager();
          $rootScope.success_tip=false;
          if(callback){callback()}
        }, 2500);
      }
    },
    dialog:function(type, btns, msg, callback, textCenter){
      this.mask();
      if(!this.$dialog){

        this.$dialog=($('<div class="dialog_txtBox"><div class="dialog_title" ng-bind="messager.dialog_title"></div><p ng-bind-html="messager.dialog_msg" class="dialog_msg" ng-class="{true:\'textCenter\'}[messager.textCenter]"></p></div><div class="btn_box"><a href="javascript:void(0)" ng-repeat="btn in messager.btns" ng-click="dialogHandler(btn.callback)">{{btn.txt}}</a></div>').appendTo("#dialog"));
        // this.$dialog=($('<p ng-bind-html="messager.dialog_msg" class="dialog_msg"></p><div class="btn_box"><a href="javascript:void(0)" ng-repeat="btn in messager.btns" ng-click="dialogHandler(btn.callback)">{{btn.txt}}</a></div>').appendTo("#dialog"));

        $injector.get('$compile')(this.$dialog)($rootScope);//重新编译动态插入的dom，注入作用域
      }
      $rootScope.black_bg=1;
      $rootScope.messager.btns=btns;
      $rootScope.messager.showDialog=1;
      $rootScope.messager.dialog_title=msg.title||"提示";
      $rootScope.messager.dialog_msg=$sce.trustAsHtml(msg.msg);
      if(textCenter){
        $rootScope.messager.textCenter = true;
      }else{
        $rootScope.messager.textCenter = false;
      }
      $timeout(function(){
        if(callback)callback()
      },100)
    },
    hideMessager:function(fn){
      $timeout(function(){
        $rootScope.messager.showTip=0;
        $rootScope.messager.showDialog=0;
        $rootScope.messager.showMask=0;
        $rootScope.messager.showMask=0;
        $rootScope.messager.btns=[];
        if(fn)fn();
      },1);
    },
    showMask:function(){
      $rootScope.showMask=1;
    },
    hideMask:function(){
      $rootScope.showMask=0;
    },
    showShareTip:function(){
      this.mask();
      if(!this.$shareTip){

        this.$shareTip=($('<div class="shareTip" ng-show="messager.showShare"><img src="images/picture_fx.png" /></div>').appendTo("#msg_mask"));
        $injector.get('$compile')(this.$shareTip)($rootScope);//重新编译动态插入的dom，注入作用域
      }
      $rootScope.messager.showShare = 1;
      this.timer = $timeout(function(){
        self.messager.hideMessager();
        $rootScope.messager.showShare=false;
      }, 2000);
    }
  };

  $rootScope.dialogHandler = function(fn){
    self.messager.hideMessager(fn);
  };


  return self;
}]);


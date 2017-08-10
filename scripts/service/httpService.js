/**
 * Created by charlie on 2016/4/27.
 */
redApp.factory('HttpService', ['$rootScope', '$http', '$state', '$q', 'EnumSet', 'UtilService', function($rootScope, $http, $state, $q, EnumSet, UtilService){

  var self = this;
  self.serverCode = {
    '00000':'请求成功',
    '999':'服务端异常'
  };
  /**
   * httpRequest : 单次请求
   * @param module : 接口所属模块
   * @param urlCode : 接口地址code
   * @param params : 接口入参
   * @returns {*}
   */
  self.httpRequest = function(module, urlCode, params){//, succCallback, errCallback){
    var deferred = $q.defer();
    params.loadinfo ? ($rootScope.loadinfo = params.loadinfo) : "正在加载";
    var url = EnumSet.serverApi.baseUrl+EnumSet.serverApi.apiUrl[module][urlCode];
    //$http服务是一个函数，返回一个promise对象
    $http({
      method: 'GET',
      url: url,
      dataType:'json',
      data:params,
      timeout: 60000
    })
      .success(function (data) {
        $("#init_mask").remove();
        $rootScope.$broadcast('loadingUnActive');
        var code = data.code;
        if (code === "00000") {
          deferred.resolve(data);
        }else {
          //错误信息包含token无效，文案重写
          if(data.errorMsg.indexOf("活动令牌无效")!=-1){
            data.errorMsg='连接超时，请退出重试~';
            UtilService.messager.tip(data.errorMsg,false);
          }else{
            UtilService.messager.tip(data.errorMsg);
          }
          deferred.reject(data)
        }
      })
      .error(function (error) {
        deferred.reject(error)
      });
    return deferred.promise;
  }
  /**
   * multiRequest: 批量请求
   * @params : promiseArr promise数组
   *
   */
  self.multiRequest = function( promiseArr ){
    var deferred = $q.defer();
    $q.all(promiseArr)
      .then(function(data){
        deferred.resolve(data);
      });
    return deferred.promise;
  }
  return self;
}]);

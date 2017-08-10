/**
 * Created by charlie on 2016/4/27.
 */
angular.module('redApp').config(['$httpProvider', function($httpProvider){
  $httpProvider.interceptors.push('loadingInterceptor');
}])
.directive('loading', ['$rootScope', function($rootScope) {
  return {
    restrict: 'AE',
    replace: true,
    template: '<div class="mask" ng-show="showLoading==true"><i class="v_m"></i><div class="loading" id="loading"><img src="images/ico-spinner.png" class="rotation"/><div  ng-bind="loadinfo">正在加载</div></div></div>',
    link: function ($scope, $attr, $e) {
      $rootScope.$on('loadingActive', function(){$scope.showLoading = true});
      $rootScope.$on('loadingUnActive', function(){$scope.showLoading = false});
    }
  }
}])
.factory('loadingInterceptor', ['$rootScope', '$q', 'EnumSet','UtilService',
  function($rootScope, $q, EnumSet, UtilService){
    var ignoreTip = false;
    return {
      request:function(config){
        if(config.data){
          //忽略显示loading效果
          if(config.data.ignoreLoading){
            ignoreTip = true;
          }
        }
        if(!ignoreTip){
          $rootScope.loadinfo="正在加载";
          $rootScope.$broadcast('loadingActive');
        }
        return config;
      },
      requestError:function(e){
        $("#init_mask").remove();
        $rootScope.$broadcast('loadingUnActive');
            //UtilService.messager.tip('无网络连接，请检查您的网络设置');
        return $q.reject(e);
      },
      response:function(data){
       $rootScope.$broadcast('loadingUnActive');
        return data;
      },
      responseError:function(e){  //http error code 统一错误处理
        $rootScope.$broadcast('loadingUnActive');
        var error = EnumSet.httpCode[""+e.status] || "请求失败，请稍后再试";
        if(!ignoreTip)UtilService.messager.tip(error);
        return $q.reject(e);
      }
    }
  }
]);

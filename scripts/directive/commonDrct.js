/**
 * Created by charlie on 2016/6/28 0028.
 */
angular.module("redApp").directive('commonDrct', ['$rootScope',function ($rootScope) {
  return {
    restrict: 'AE',
    link: function ($scope, $e, $attr) {
      var $body = $('body');
      var $iframe = null;
      $rootScope.updateTitle = function(title){
        if($iframe)$iframe.remove();
        document.title = title;
        // hack在微信等webview中无法修改document.title的情况
        $iframe = $('<iframe src="favicon.ico"></iframe>').on('load', function() {
          setTimeout(function() {
            $iframe.off('load').remove()
          }, 0)
        }).appendTo($body);
      }


    }
  }
}]);

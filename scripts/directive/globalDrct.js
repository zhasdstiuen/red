angular.module("redApp").directive('globalDrct',function(){
  return {
    restrict: 'AE',
    link: function () {
      //设置页面的根fontsize
      function setHtmlFontsize(){
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
      }
      setHtmlFontsize();
      // 当旋转屏幕时，重新设置页面的根fontsize
      $(window).resize(function(){
        setHtmlFontsize();
      });

    }
  };
});
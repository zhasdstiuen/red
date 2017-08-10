/**
 * Created by qiangxl on 2017/1/7.
 */

(function(win, doc, $) {

  var defaultOpt = {

    rotateNum: 5, //转盘转动圈数
    body: "", //大转盘整体的选择符或zepto对象
    direction:0,
    disabledHandler: function() {}, //禁止抽奖时回调
    clickCallback: function() {}, //点击抽奖按钮,再次回调中实现访问后台获取抽奖结果,拿到抽奖结果后显示抽奖画面
    KinerLotteryHandler: function(deg) {} //抽奖结束回调
  };

  function KinerLottery(opts) {

    this.opts = $.extend(true, {}, defaultOpt, opts);
    this.doing = false;
    this.init();
  }

  KinerLottery.prototype.setOpts = function(opts) {
    this.opts = $.extend(true, {}, defaultOpt, opts);
    this.init();
  };

  KinerLottery.prototype.init = function() {
    var self = this;
    this.defNum = this.opts.rotateNum * 360; //转盘需要转动的角度
    // console.log(this.defNum);
    // alert(this.defNum);
    //点击抽奖
    $('.u-zp-zz').on('click', function() {
      if (!self.doing) {
        self.opts.clickCallback.call(self);
      } else {
        var key = $(this).hasClass('no-start') ? "noStart" : $(this).hasClass('completed') ? "completed" : "illegal";
        self.opts.disabledHandler(key);
      }
    });

    $(this.opts.body).get(0).addEventListener('webkitTransitionEnd', function() {

      self.doing = false;
      $(self.opts.body).find('.u-zp-zz').removeClass('doing');
      var deg = $(self.opts.body).attr('data-deg');


      $(self.opts.body).find('.u-zp').css({
          '-webkit-transition': 'none',
          'transition': 'none',
          '-webkit-transform': 'rotate(' + (deg) + 'deg)',
          'transform': 'rotate(' + (deg) + 'deg)'
      });
      self.opts.KinerLotteryHandler(deg);
    });



  };


  KinerLottery.prototype.goKinerLottery = function(_deg) {

    if (this.doing) {
      return;
    }
    var deg = _deg + this.defNum;
    var realDeg = this.opts.direction == 0 ? deg : -deg;
    this.doing = true;
    $(this.opts.body).find('.u-zp-zz').addClass('doing');

    $(this.opts.body).find('.u-zp').css({
      '-webkit-transition': 'all 5s',
      'transition': 'all 5s',
      '-webkit-transform': 'rotate(' + (realDeg) + 'deg)',
      'transform': 'rotate(' + (realDeg) + 'deg)'
    });
    $(this.opts.body).attr('data-deg', _deg);

  };



  win.KinerLottery = KinerLottery;

})(window, document, $);
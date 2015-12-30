// (function(win, doc, $, Vue) {
  var manifest = [
    //bgm
    './audios/bgm.mp3',
    //荔枝logo
    './images/lizhi_logo.png',
    './images/lizhi_shadow.png',
    //page1
    './images/page1_title.png',
    './images/page1_bg.png',
    './images/bing_head.png',
    './images/bing_body.png',
    //page2
    './images/page2_title.png',
    './images/zhou.png',
    './images/kun.png',
    './images/cake.png',
    //paeg3
    './images/page3_bg.png',
    './images/duang.png',
    './images/chenglong_body.png',
    './images/chenglong_head.png',
    //paeg4
    './images/page4_title.png',
    './images/page4_bg.png',
    './images/envelope_back.png',
    './images/envelope_front.png',
    './images/paper.png',
    // //page5
    './images/page5_title.png',
    './images/page5_bg.png',
    './images/rocket.png',
    './images/yan1.png',
    './images/yan2.png',
    './images/yan3.png',
    './images/yan4.png',
    // //page6
    './images/page6_title.png',
    './images/page6_bg.png',
    './images/star.png',
    // //page7
    './images/page7_title.png',
    './images/page7_bg.png',
    './images/xidada.png',
    './images/xidada_hand.png',
    // //page8
    './images/page8_title.png',
    './images/langya_bg.png',
    './images/langya.png',
    // //page9
    './images/yangshi.png',
    './images/page9_title.png',
    './images/wu1.png',
    './images/wu2.png',
    './images/wu3.png',
    './images/wu4.png',
    './images/wu5.png',
    './images/wu6.png',
    './images/wu7.png',
    // //runway
    './images/runway_start.png',
    './images/runway_body.png'
  ];

  function removeLoading() {
    var $loading = $('.layer-loading');
    var $page = $('.container');
    $('.percentage').text('100%');
    $loading.addClass('hide');
    $page.removeClass('hide');
    setTimeout(function() {
      $loading.hide();
    }, 600)
  }

  var load = loader(manifest);
  load.on('progress', function(per) {
    $('.percentage').text(per+'%');
  });
  load.on('success', function() {
    removeLoading();
  });
  setTimeout(function() {
    removeLoading();
  }, 5000);

  var app = new Vue({
    el: '#rundown',
    data: {
      speed: 0,
      translateDuration: 40000,
      rotateDuration: 2500,
      currentPage: 0,
      scrollEl: $('.scrollWrap'),
      scrollX: '',
      runwayLen: parseInt($('.pageWrap').css('width')) - 640,
      interval: 0,
      canRun: false,
      lizhi: $('.run .lizhi-logo'),
      bgm: true,
      shareLayer: false,
      isEnd: false,
      audio: $('#bgm')[0]
    },
    ready: function() {
      var self = this;
      if ($(window).height() < 960) { $('.page').addClass('scale'); }
      window.addEventListener('deviceorientation', self.setSpeed, false);
      $('.scrollWrap').on('webkitTransitionEnd', function() { self.stop(); });
      self.audio.addEventListener('ended', function() {
        self.audio.play();
      });
    },
    methods: {
      handelInterval: function() {
        var self = this;
        self.interval = setInterval(function() {
          var currentX = self.getCurrentX();
          if (currentX < -450) { self.currentPage = 1; }
          if (currentX < -1300) { self.currentPage = 2; }
          if (currentX < -1500) { self.currentPage = 3; }
          if (currentX < -2900) { self.currentPage = 4; }
          if (currentX < -3600) { self.currentPage = 5; }
          if (currentX < -4360) { self.currentPage = 6; }
          if (currentX < -5400) { self.currentPage = 7; }
          if (currentX < -6400) { self.currentPage = 8; }
          if (currentX < -7100) { self.currentPage = 9; }
        }, 500);
      },
      setSpeed: function(e) {
        if (!this.canRun) return;
        var x = parseInt(e.gamma / 10);
        if (x > 0) {
          this.speed = 1;
        } else if (x < 0) {
          this.speed = -1;
        } else {
          this. speed = 0
        }
      },
      getCurrentX: function() {
        var self = this;
        var res = $(self.scrollEl).css('transform').match(/matrix\((.*)\)/);
        var currentX = res ? res[1].split(',')[4] : 0;
        return parseInt(currentX);
      },
      rotate: function() {
        var self = this;
        var currentX = self.getCurrentX();
        if (self.speed < 0 && currentX == 0) return;
        if (self.speed > 0 && currentX == self.runwayLen) return;

        var curDeg = parseInt($.Velocity.hook($(self.lizhi), 'rotateZ'));
        if (self.speed > 0 && curDeg < 0) {
          var z = 360 + curDeg;
          $.Velocity.hook($(self.lizhi), 'rotateZ', z+'deg');
          curDeg = z;
        } else if (self.speed < 0 && curDeg > 0) {
          var z = -360 + curDeg;
          $.Velocity.hook($(self.lizhi), 'rotateZ', z+'deg');
          curDeg = z;
        }
        var duration = (360-Math.abs(curDeg))/360*self.rotateDuration || self.rotateDuration;
        $(self.lizhi).velocity({
          rotateZ: function() {
            return self.speed > 0 ? 360 : -360;
          }
        }, {
          duration: duration,
          easing: 'linear',
          complete: function() {
            $.Velocity.hook($(self.lizhi), 'rotateZ', 0)
            self.rotate();
          },
          mobileHA: true
        });
      },
      translate: function() {
        var self = this;
        var duration;
        var currentX = self.getCurrentX();
        var direction = self.speed > 0 ? 'toRight' : 'toLeft';
        if (self.speed > 0) {
          duration = (self.runwayLen - Math.abs(parseInt(currentX)))/self.runwayLen*self.translateDuration/1000;
          $(self.scrollEl).find('.guide').addClass('hide').find('.tip').addClass('hide');
        } else if ( self.speed < 0) {
          duration = (Math.abs(parseInt(currentX)))/self.runwayLen*self.translateDuration/1000;
        }
        $(self.scrollEl).css({'-webkit-transition-duration': duration + 's'})
        $(self.scrollEl).addClass(direction);
        self.handelInterval();
      },
      stop: function() {
        var self = this;
        var transform = $(self.scrollEl).css('transform');
        var currentX = Math.abs(self.getCurrentX());
        self.scrollX = transform == 'none' ? 'translateX(0)' : transform;
        $(self.scrollEl).removeClass('toRight').removeClass('toLeft');
        $(self.scrollEl).css({'-webkit-transform': self.scrollX });
        $(self.lizhi).velocity('stop', true);
        clearInterval(self.interval);
        if (currentX == self.runwayLen) { self.end(); }
      },
      toggleShow: function() {
        var self = this;
        var index = self.currentPage;
        $('#page'+index).addClass('animated');
        $('.page').each(function(i, page) {
          if (index - 2 < i && i < index + 2) {
            $(page).removeClass('hide');
          } else {
            $(page).addClass('hide').removeClass('animated');
          }
        });
      },
      replay: function() {
        window.location.reload();
      },
      end: function() {
        this.isEnd = !this.End;
      },
      start: function() {
        this.canRun = true;
        this.bgm = true;
        $('.guide').addClass('hide');
        $('.tip-click').addClass('hide');
        setTimeout(function() {
          $('.tip-click').hide();
          $('.guide').hide();
        }, 300)
        $('#bgm')[0].play();
        console.log('start');
      },
      toggleBGM: function() {
        this.bgm = !this.bgm;
        var audio = $('#bgm')[0];
        if (this.bgm) {
          audio.play();
        } else {
          audio.pause();
        }
      },
      toggleShareLayer: function() {
        this.shareLayer = !this.shareLayer;
      }
    }
  });

  app.$watch('speed', function() {
    if (!this.canRun) return;
    this.stop();
    if (this.speed != 0) {
      this.rotate();
      this.translate();
    }
  });

  app.$watch('currentPage', function() {
    this.toggleShow();
  });

  //分享
  var url = 'http://h5.lizhi.fm/getJSConfig?url=http://h5.lizhi.fm/comp/';
  $.ajax({
    url: 'http://h5.lizhi.fm/getJSConfig',
    data: { url: 'http://h5.lizhi.fm/congra/' },
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'showOptionMenu', 'hideOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function () {
        var shareData = {
          title: "滚动吧，荔枝君", // 分享标题
          link: "http://h5.lizhi.fm/congra/", // 分享链接
          imgUrl: "http://h5.lizhi.fm/congra/images/wx_cover.jpg", // 分享图标
          desc: ""
        };
        wx.onMenuShareTimeline(shareData);
        wx.onMenuShareAppMessage(shareData);
      });
    },
    error: function() {}
  });


// })(window, document, Zepto, Vue);

// (function(win, doc, $, Vue) {
  var manifest = [
    './images/lizhi_logo.png',
    './images/lizhi_shadow.png',
    './images/page1_title.png',
    './images/page1_bg.png',
    './images/bing_head.png',
    './images/bing_body.png',
    './images/page2_title.png',
    './images/zhou.png',
    './images/kun.png',
    './images/cake.png',
    './images/page3_bg.png',
    './images/duang.png',
    './images/chenglong_body.png',
    './images/chenglong_head.png'
  ];

  function loadNum(per) {
    var end = parseInt(per);
    var start = parseInt($('.percentage').text());
    for (;start <= end; start++) {
      $('.percentage').text(start+'%');
    }
  }

  var load = loader(manifest);
  load.on('progress', function(per) {
    loadNum(per);
  });
  load.on('success', function() {
    var $loading = $('.layer-loading');
    var $page = $('.container');
    loadNum(100);
    $loading.addClass('hide');
    $page.removeClass('hide');
    setTimeout(function() {
      $loading.hide();
    }, 600)
  })


  var app = new Vue({
    el: '.container',
    data: {
      speed: 0,
      translateDuration: 35000,
      rotateDuration: 2500,
      currentPage: 0,
      scrollEl: $('.scrollWrap'),
      scrollX: '',
      runwayLen: parseInt($('.pageWrap').css('width')) - 640,
      interval: 0,
      canRun: true,
      lizhi: $('.run .lizhi-logo')
    },
    ready: function() {
      var self = this;
      window.addEventListener('deviceorientation', self.setSpeed, false);
      $('.scrollWrap').on('webkitTransitionEnd', function() { self.stop(); 
      });
    },
    methods: {
      handelInterval: function() {
        var self = this;
        self.interval = setInterval(function() {
          var currentX = self.getCurrentX();
          if (currentX < -450) { self.currentPage = 1; }
          if (currentX < -1300) { self.currentPage = 2; }
          if (currentX < -1700) { self.currentPage = 3; }
          if (currentX < -2800) { self.currentPage = 4; }
          if (currentX < -3500) { self.currentPage = 5; }
          if (currentX < -4360) { self.currentPage = 6; }
          if (currentX < -5400) { self.currentPage = 7; }
          if (currentX < -6400) { self.currentPage = 8; }
          if (currentX < -7100) { self.currentPage = 9; }
          console.log(currentX);
        }, 500);
      },
      setSpeed: function(e) {
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
        console.log('stop');
      },
      toggleShow: function() {
        var self = this;
        var index = self.currentPage;
        console.log('page'+index)
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
        setTimeout(function() {
          $('.container').addClass('hide');
          $('.end').removeClass('hide');
          $('.lizhi-logo.run').css({
            '-webkit-transform': 'rotate(0)'
          });
        }, 1000);
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

  $('#replay').on('touchend', function() {
    app.replay();
  });



  $('.pos').on('click', function() {
    app.speed = 2;
  });

  $('.pos2').on('click', function() {
    app.stop();
  });

  $('.pos3').on('click', function() {
    $('.page').toggleClass('animated');
  });





// })(window, document, Zepto, Vue);

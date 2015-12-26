// (function(win, doc, $, Vue) {
  var app = new Vue({
    el: '.container',
    data: {
      speed: 0,
      translateDuration: 30000,
      rotateDuration: 2500,
      currentPage: 0,
      scrollEl: $('.scrollWrap'),
      scrollX: '',
      runwayLen: parseInt($('.pageWrap').css('width')) - 640,
      interval: 0
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
          var res = $(self.scrollEl).css('transform').match(/matrix\((.*)\)/);
          var currentX = res ? res[1].split(',')[4] : 0;
          if (currentX < -450) { self.currentPage = 1; }
          if (currentX < -1300) { self.currentPage = 2; }
          if (currentX < -2800) { self.currentPage = 4; }
          if (currentX < -3500) { self.currentPage = 5; }
          if (currentX < -5400) { self.currentPage = 7; }
          if (currentX < -6000) { self.currentPage = 6; }
          if (currentX < -7300) { self.currentPage = 9; }
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
      rotate: function() {
        var self = this;
        var curDeg = parseInt($.Velocity.hook($('.lizhi-logo'), 'rotateZ'));
        if (self.speed > 0 && curDeg < 0) {
          var z = 360 + curDeg;
          $.Velocity.hook($('.lizhi-logo'), 'rotateZ', z+'deg');
          curDeg = z;
        } else if (self.speed < 0 && curDeg > 0) {
          var z = -360 + curDeg;
          $.Velocity.hook($('.lizhi-logo'), 'rotateZ', z+'deg');
          curDeg = z;
        }
        var duration = (360-Math.abs(curDeg))/360*self.rotateDuration || self.rotateDuration;
        $('.lizhi-logo').velocity({
          rotateZ: function() {
            return self.speed > 0 ? 360 : -360;
          }
        }, {
          duration: duration,
          easing: 'linear',
          complete: function() {
            $.Velocity.hook($('.lizhi-logo'), 'rotateZ', 0)
            self.rotate();
          },
          mobileHA: true
        });
      },
      translate: function() {
        var self = this;
        var duration;
        var res = $(self.scrollEl).css('transform').match(/matrix\((.*)\)/);
        var currentX = res ? res[1].split(',')[4] : 0;
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
        self.scrollX = transform == 'none' ? 'translateX(0)' : transform;
        $(self.scrollEl).removeClass('toRight').removeClass('toLeft');
        $(self.scrollEl).css({'-webkit-transform': self.scrollX });
        $('.lizhi-logo').velocity('stop', true);
        clearInterval(self.interval);
        console.log('stop');
      }
    }
  });

  app.$watch('speed', function() {
    this.stop();
    if (this.speed != 0) {
      this.rotate();
      this.translate();
    }
  });

  app.$watch('currentPage', function() {
    var index = this.currentPage;
    $('#page'+index).addClass('animated');
    console.log(index);
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

function isMobile() {
  return !!(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i))
}

svg4everybody(); //for svg spite in ie
objectFitImages();

let $body,
  wWidth = 0,
  wHeight = 0,
  W_SM = 576,
  W_MD = 768,
  W_LG = 992,
  W_XL = 1200,
  LOADER_HTML =
  '<div class="overlay-loader"><div class="loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';

$(document).ready(function() {
  $body = $("body");

  tabs();

  headerSearch();
  mobileMenu();

  map();
  commonScript();
  form();
  accordion();



  function tabs() {
      $(document).on('click', '[data-tab-target]', function(e) {
          e.preventDefault();

          let $this = $(this);
          //   $('.js-standart-slider.slick-initialized').slick('setPosition');
          $this.addClass('is-active').siblings().removeClass('is-active');
          //   var htmlActive = $this.html();
          //   $this.closest('.tabs-wrap').find('.js-tabs-name-mob').html(htmlActive);
          let targetTab = $(this).data('tab-target'),
              tab = $(document).find('[data-tab="' + targetTab + '"]'),
              tabGroup = tab.data('tab-group');


          $(document).find('.is-active[data-tab-group="' + tabGroup + '"]').addClass('is-proccess');


          setTimeout(function() {
              $(document).find('[data-tab-group="' + tabGroup + '"]').removeClass('is-active').removeClass('is-proccess');
              // tab.addClass('is-active');

              tab.show(0, function() {
                  $(this).addClass('is-active');

              });
          }, 300)


      });
  }

  function headerSearch() {
      let opening = false,
          transitionTime = 300,
          openClass = 'is-open-header-search',
          timeout;

      $body.on('click touch', '.js-header-search-trigger', function(e) {
          e.preventDefault();

          if (opening) {
              return
          }

          opening = true;

          $body.toggleClass(openClass);

          if (timeout) {
              clearTimeout(timeout)
          }

          timeout = setTimeout(function() {
              opening = false;

              if (isFormOpen()) {
                  $('.header-search-form input[type=search]').focus();
              }
          }, transitionTime)

      });

      $body.on('click touch', function(event) {
          var obj = $(event.target);

          if ($body.hasClass(openClass) &&
              !obj.closest('.header-search-form').length &&
              !obj.closest('.js-header-search-trigger').length &&
              !obj.hasClass('js-header-search-trigger')
          ) {
              $body.removeClass(openClass);
          }
      });

      function isFormOpen() {
          return $body.hasClass(openClass)
      }
  }

  function mobileMenu() {
      let mobileNav = $('.mobile-menu'),
          mobileNavIsOpen = mobileNav.hasClass('is-open'),
          openClass = 'is-mobile-menu-open',
          opening = false,
          transitionTime = 300,
          timeout;

      $body.on('click touch', '.js-mobile-menu-trigger', function(e) {
          e.preventDefault();


          navToggle();
      });


      function navToggle() {

          if (opening) {
              return
          }

          opening = true;

          mobileNavIsOpen = mobileNav.hasClass('is-open');

          mobileNav.toggleClass('is-open', !mobileNavIsOpen);

          $body
              .removeClass('is-open-choice-language')
              .removeClass('is-open-top-links');


          if (!mobileNavIsOpen) {
              window.globalOptions.freeze(true); //true is scroll to top page
              $body.toggleClass(openClass, true);
          }

          if (timeout) {
              clearTimeout(timeout)
          }

          timeout = setTimeout(function() {
              mobileNavIsOpen = mobileNav.hasClass('is-open');

              if (!mobileNavIsOpen) {
                  $body.toggleClass(openClass, false);
                  window.globalOptions.unfreeze();


              }
              opening = false;
          }, transitionTime)
      };
  }

  function commonScript() {
      $('.s-members').each(function() {
          let wrap = $(this)
          slider = wrap.find('.js-slider'),
              prevBtn = wrap.find('.js-slider-prev'),
              nextBtn = wrap.find('.js-slider-next');

          wrap.addClass('is-slider-initialized');
          slider.slick({
              // centerMode: true,
              // variableWidth: true,
              infinite: true,
              adaptiveHeight: false,
              arrows: true,
              prevArrow: prevBtn,
              nextArrow: nextBtn,
              slidesToShow: 1,
              slidesToScroll: 1,
              // responsive: [
              //     {
              //         breakpoint: window.globalOptions.sizes.lg,
              //         settings: {
              //             slidesToShow: 2,
              //             slidesToScroll: 2,
              //         }
              //     },
              //     {
              //         breakpoint: window.globalOptions.sizes.md,
              //         settings: {
              //             slidesToShow: 2,
              //             slidesToScroll: 2,
              //         }
              //     },
              //     {
              //         breakpoint: window.globalOptions.sizes.sm,
              //         settings: {
              //             slidesToShow: 1,
              //             slidesToScroll: 1,
              //         }
              //     }

              // ]
          });
      });
  }


  function map() {
      if ($('.js-map-yandex').length === 0) {
          return
      } else {
          $('.js-map-yandex').each(function() {
              initMap($(this));
          });
      };


      function initMap(el) {
          var mapWrap = el,
              mapPoints = mapWrap.find('.js-map-yandex-points'),
              mapArea = mapWrap.find('.js-map-yandex-area'),
              map;


          if (map == undefined && window.ymaps != undefined) {
              mapArea.html('');
              ymaps.ready(function() {
                  map = new ymaps.Map(mapArea[0], {
                      center: [+mapPoints.data('c-lat'), +mapPoints.data('c-long')],
                      zoom: +mapPoints.data('zoom'),
                      controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
                  });


                  map.behaviors.disable('scrollZoom');
                  if (isMobile()) {
                      map.behaviors.disable('drag');
                  };


                  mapPoints.find('li').each(function() {
                      if ($(this).data('lat')) {
                          var $this = $(this),
                              lat = +$this.data('lat'),
                              lng = +$this.data('long'),
                              title = $this.data('title')
                          // pin = 'img/map-pin.png'
                          ;

                          var placemark = new ymaps.Placemark(
                              [lat, lng], {}, {
                                  iconLayout: 'default#image',
                                  // iconImageHref: pin,
                                  // iconImageSize: [49, 61],
                                  // iconImageOffset: [-25, -61],
                                  hideIconOnBalloonOpen: false,
                                  // balloonOffset: [3, -100]
                              });

                          map.geoObjects.add(placemark);
                      }
                  });
              });
          };
      }


  };

  function form() {

    $('.js-select').niceSelect();
  }

  function accordion() {
    if ($('.js-accordion-title').length === 0) return

    let accordionTimeout = false;

    $(".js-accordion-title").on("click", function(e) {
        if (accordionTimeout) return
        
        accordionTimeout= true;

		e.preventDefault();
		var $this = $(this),
            item = $this.closest(".js-accordion-item"),
		    content = item.find(".js-accordion-content");

            console.log(item.hasClass("is-active"))

        if (item.hasClass("is-active")) {
            content.slideUp();
            item.removeClass("is-active")
        } else {
            item.addClass("is-active")
            content.slideDown();
        }

        setTimeout(() => {
            accordionTimeout = false;
        }, 400)
	});
  }
});

window.globalOptions = {
  animationDuration: 200,
  sizes: {
      xl: 1920,
      lg: 1200,
      md: 992,
      sm: 768,
      xs: 576
  },
  freeze: function() {
      const h = $('html');

      if (h.css('position') !== 'fixed') {
          const top = h.scrollTop() ? h.scrollTop() : $body.scrollTop();

          if (window.innerWidth > h.width()) {
              h.css('overflow-y', 'scroll');
          }

          h.css({
              width: '100%',
              position: 'fixed',
              top: -top,
          });
      }
  },

  unfreeze: function() {
      const h = $('html');

      if (h.css('position') === 'fixed') {
          h.css('position', 'static');

          $('html, body').scrollTop(-parseInt(h.css('top'), 10));

          h.css({
              position: '',
              width: '',
              top: '',
              'overflow-y': '',
          });
      }
  },

  scrollToId: function(href, delay) {
      let scrollOnMenuBtn = false,
          scrollOnHeaderHide = false,
          scrollSpeed = 800;


      if (href == '#interior' ||
          href == '#magazines'
      ) {
          scrollOnMenuBtn = true;
      }


      setTimeout(function() {
          scrollTo();
      }, delay)

      function scrollTo() {

          let targetOffset = $(href).offset().top;

          // if ( wWidth >= W_MD && scrollOnMenuBtn ) {
          //     targetOffset -= $('.side-nav__trigger-icon-line--1').offset().top - $('.header').offset().top;
          // } else if (wWidth < W_MD && !scrollOnHeaderHide) {
          //     targetOffset -= $('.header').outerHeight();
          // }

          try {
              scrollSpeed = Math.abs($window.scrollTop() - targetOffset) / Math.abs($body[0].scrollHeight) * 4000
          } catch (event) {
              console.error(event);
          }

          scrollSpeed = (scrollSpeed < 500) ? 500 : scrollSpeed;

          $('html, body').animate({
              scrollTop: targetOffset
          }, scrollSpeed);

          location.replace(href);

      }
  }
};
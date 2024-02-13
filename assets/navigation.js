$(document).ready(function() {
  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('#sticky-header').outerHeight();

  $(window).scroll(function(event){
      didScroll = true;
  });

  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);

  function hasScrolled() {
      var st = $(this).scrollTop();

      // Make sure they scroll more than delta
      if(Math.abs(lastScrollTop - st) <= delta)
          return;

      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight){
          // Scroll Down
          $('#sticky-header').removeClass('nav-down').addClass('nav-up');
      } else {
          // Scroll Up
          if(st + $(window).height() < $(document).height()) {
              $('#sticky-header').removeClass('nav-up').addClass('nav-down');
          }
      }

      lastScrollTop = st;
  }

  // $(".site-nav--has-dropdown").on("mouseenter", function() {
  //   $(this).children('.site-nav__dropdown').addClass('open');
  // }).on("mouseleave", function() {
  //   $(this).children('.site-nav__dropdown').removeClass('open');
  // });

  // $(".site-nav__megamenu").on("mouseleave", function() {
  //   $(this).parent('.site-nav__dropdown').removeClass('open');
  // });


  // $(".site-nav--item").hide();


});

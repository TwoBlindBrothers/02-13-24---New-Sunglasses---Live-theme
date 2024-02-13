// function openSub(e) {
//
//     if (!trigger) {
//         e.preventDefault();
//         $(".site-menu__sub").show();
//         trigger = true;
//     }
// }

// function close() {
//   $(".site-menu__sub").slideUp();
//   $(".site-nav--item").data("closed", true);
//   // console.log('here');
// }

// $(".site-nav--item").click(function(e) {
//
//   var nav = $(this);
//
//   if (nav.data("closed") && (nav.data("has-sub"))) {
//     e.preventDefault();
//
//     $.when(close()).done(function() {
//
//       var sub = nav.data("sub");
//
//       $("#sub-" + sub).slideDown();
//
//       nav.data("closed", false);
//
//       opened = true;
//
//       setTimeout(function(){
//         $("#sub-" + sub).find(".site-menu__sub--inner").addClass("visible");
//       }, 1000);
//     });
//   }
// })
//
// function closeSub() {
//     trigger = false;
//
//     $(".site-menu__sub").slideUp();
// }

function popupClose() {
    trigger = false;

    $(".popup").hide();

    Cookies.set('popup', 'hidden', { sameSite: true });
}

$(document).ready(function() {

    var popup = Cookies.get('popup');

    if (popup == 'hidden') {

    } else {

        setTimeout(function(){
          $(".popup").fadeIn();
        }, 5000);
    }

});

$(".mobile-menu--toggle").click(function() {
    $(".mobile-menu").fadeIn();
});

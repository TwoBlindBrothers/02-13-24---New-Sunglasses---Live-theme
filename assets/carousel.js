if ( $('.carousel-slides, .product-slides') ) {
  $('.carousel-slides, .product-slides').each( (i, slideshow) => {
    const slickObj = {
      arrows: true,
      dots: false,
      slidesToShow: 4,
      slidesToScroll: 4,
      adaptiveHeight: true,
      prevArrow: $(slideshow).parent().find('.arrow-left'),
      nextArrow: $(slideshow).parent().find('.arrow-right'),
      responsive: [
        {
          breakpoint: 1224,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        },
        {
          breakpoint: 915,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    }
    $(slideshow).slick(slickObj)
  })
}

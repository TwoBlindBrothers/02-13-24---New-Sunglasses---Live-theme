if ( $('.upsell-2bb').length ) {

  $('.upsell-product-element:first-of-type').show()

//   $('.cart__checkout').on('click', function(e) {
//     e.preventDefault();
//     $('.upsell-2bb').addClass('active')
//     return
//   })

  $('.upsell-popup .close-popup, .upsell-description .no-thanks').on('click', function(e) {
      e.preventDefault()
      closeUpsellPopup()
  })

  $('.upsell-popup .close-popup').on('keydown', function(e) {
    if ( e.keyCode === 9 && !e.shiftKey ) {
      e.preventDefault()
      $('.upsell-popup h2').focus()
    }
  })
  $('.upsell-popup h2').on('keydown', function(e) {
    if ( e.keyCode === 9 && e.shiftKey ) {
      e.preventDefault()
      $('.upsell-popup .close-popup').focus()
    }
  })

  $('input[type=radio][name=upsell-select]').change( function () {
    const id = $( 'input[name=upsell-select]:checked' ).val()
    $('.upsell-product-element').hide()
    $(`.upsell-product-${id}`).show()
  })

  $('.details-toggle').on('click', function(e) {
    e.preventDefault()
    if ( $('.upsell-details ul').is(':visible') ) {
      $('.upsell-details ul').removeAttr('tabindex')
      $('.upsell-details ul').attr('aria-hidden', 'true')
    } else {
      $('.upsell-details ul').removeAttr('aria-hidden')
      $('.upsell-details ul').attr('tabindex', '0')
    }
    $('.upsell-details ul').toggle()
  })

  $('.add-to-cart').on('click', function(e) {
    e.preventDefault()
    const productSelect = document.getElementsByName('upsell-select')
    let productId = null;
    for ( i = 0; i < productSelect.length; i++ ) {
      if ( productSelect[i].checked ) {
        productId = productSelect[i].value
      }
    }
    $(this).text('adding to cart')
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      dataType: 'json',
      data: {
        quantity: 1,
        id: productId
      },
      success: function (response) {

      },
      error: function (obj, status) {
        ShopifyAPI.onError(obj, status)
      },
      complete: function () {
          closeUpsellPopup(productId)
      }
    });
  })

  function closeUpsellPopup (productId) {
      $('.upsell-2bb #popup-loader').addClass('active')
      if ( $('.upsell-popup').data('alt-index') === undefined ) {
          window.location.href = `/checkout${ productId ? '?2bb_us=' + productId : '' }`
      } else {
            $('#dynamic-checkout-cart ul li').eq($('.upsell-popup').data('alt-index')).find('[role="button"],button').click()
      }
  }
}

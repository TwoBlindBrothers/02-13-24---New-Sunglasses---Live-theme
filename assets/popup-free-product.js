if ( $('.free-product-popup').length ) {
  if ( $('#AddToCart').length ) {
    const cart = ShopifyAPI.getCart(cart => {
      let hasPromo = false
      $.each(cart.items, item => {
        if ( item.product_type == 'Sock Promo' ) {
          hasPromo = true
          return
        }
      })
      if ( !hasPromo ) {
        $('#AddToCart').attr('aria-haspopup', 'dialog')
      }
    })
  }
  const $freePopup = document.getElementById("free-product-2bb-container")
  let prevState = $freePopup.classList.contains('active');
  var mut = new MutationObserver(function(mutations, mut){
    // if attribute changed === 'class' && 'open' has been added, add css to 'otherDiv'
    mutations.forEach((mutation) => {
      const { target } = mutation;

      if (mutation.attributeName === 'class') {
        const currentState = mutation.target.classList.contains('active');
        if (prevState !== currentState) {
          prevState = currentState;
          if ( currentState ) {
            showFreeProductPopup()
          }
        }
      }
    });
  });
  mut.observe($freePopup,{
    'attributes': true
  });

  function showFreeProductPopup () {
    const $productsWrapper = $('.free-product-content')
    const $productsInner = $('.free-product-inner')
    const products = $('.free-product-2bb').data('products').split(',')
    $('#CartDrawer').removeAttr('tabindex');
    const appendArray = $.map( products, function (handle, index) {
      return new Promise((resolve, reject) => {
        params = {
          type: 'GET',
          url: `/products/${handle}?view=form-only`,
          dataType: 'html',
          success: function(product) {
            return product
          },
          error: function(XMLHttpRequest, textStatus) {
            //$body.trigger('errorUpdateCartNote.ajaxCart', [XMLHttpRequest, textStatus]);
            //ShopifyAPI.onError(XMLHttpRequest, textStatus);
          },
          complete: function(jqxhr, text) {
            //$body.trigger('completeUpdateCartNote.ajaxCart', [this, jqxhr, text]);
          }
        };
        return $.ajax(params).then(function (product) {
          resolve(product)
        });
      })
    })
    Promise.all(appendArray).then( products => {
      $.each(products, (index, product) => {
        $($productsInner).append(product)
      })
      var img = new Image();
      img.onload = function() {
        setTimeout( function () {
          const productsHeight = $($productsInner).height()
          $($productsWrapper).height(`${productsHeight}px`)
          $('.free-product-loader').fadeOut('fast')
          setTimeout( function () {
            showFreePopup ()
          }, 500)
        }, 300)
      }
      img.src = $('.free-product-content .product-single__photos img').attr('src');
    });

    function closeFreePopupOnEsc (e) {
      if (e.key === "Escape") { // escape key maps to keycode `27`
        closeFreePopup()
      }
    }

    function showFreePopup () {
      $($productsInner).addClass('active')
      $('.free-product-popup .close-popup').on('click', function(e) {
        closeFreePopup()
      })

      $('.free-product-popup .product-single:first-of-type .swatch-element:first-of-type input').focus()
      const focusEls = $freePopup.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]');
      $(focusEls[0]).focus()

      $(document).on('keyup', function (e) {
        closeFreePopupOnEsc(e)
      });

      // tabbing forward
      $('.free-product-popup .close-popup').on('keydown', function(e) {
        if ( e.keyCode === 9 && !e.shiftKey ) {
          e.preventDefault()
          $('.free-product-popup h2').focus()
        }
      })
      // tabbing backward
      $('.free-product-popup h2').on('keydown', function(e) {
        if ( e.keyCode === 9 && e.shiftKey ) {
          e.preventDefault()
          $('.free-product-popup .close-popup').focus()
        }
      })
    }

    function closeFreePopup () {
      $(document).off('keyup', function (e) {
        closeFreePopupOnEsc(e)
      });
      $('#CartDrawer').attr('tabindex', '-1');
      $('#free-product-2bb-container').removeClass('active')
      $($productsInner).removeClass('active')
      $('.free-product-popup h2, .free-product-popup .close-popup').off('keydown')
      $('.free-product-popup .close-popup').off('click')
      $($productsWrapper).height('80px')
      $($productsInner).html('')
    }
  }

  // $('.free-product-select').on('click', function (e) {
  //   e.preventDefault();
  //
  // })

  // $('.cart__checkout').on('click', function(e) {
  //   e.preventDefault();
  //   $('.upsell-2bb').addClass('active')
  //   return
  // })
  //
  // $('.free-product-popup .close-popup').on('click', function(e) {
  //   window.location.href = '/checkout?2bb_us=0';
  // })
  //
  // $('.free-product-popup .no-thanks').on('keydown', function(e) {
  //   if ( e.keyCode === 9 && !e.shiftKey ) {
  //     e.preventDefault()
  //     $('.close-popup').focus()
  //   }
  // })
  // $('.close-popup').on('keydown', function(e) {
  //   if ( e.keyCode === 9 && e.shiftKey ) {
  //     e.preventDefault()
  //     $('.free-product-popup .no-thanks').focus()
  //   }
  // })
  //
  // $('input[type=radio][name=upsell-select]').change( function () {
  //   const id = $( 'input[name=upsell-select]:checked' ).val()
  //   $('.upsell-product-element').hide()
  //   $(`.upsell-product-${id}`).show()
  // })
  //
  // $('.details-toggle').on('click', function(e) {
  //   e.preventDefault()
  //   if ( $('.upsell-details ul').is(':visible') ) {
  //     $('.upsell-details ul').removeAttr('tabindex')
  //     $('.upsell-details ul').attr('aria-hidden', 'true')
  //   } else {
  //     $('.upsell-details ul').removeAttr('aria-hidden')
  //     $('.upsell-details ul').attr('tabindex', '0')
  //   }
  //   $('.upsell-details ul').toggle()
  // })
  //
  // $('.add-to-cart').on('click', function(e) {
  //   e.preventDefault()
  //   const productSelect = document.getElementsByName('upsell-select')
  //   let productId = null;
  //   for ( i = 0; i < productSelect.length; i++ ) {
  //     if ( productSelect[i].checked ) {
  //       productId = productSelect[i].value
  //     }
  //   }
  //   $(this).text('adding to cart')
  //   $.ajax({
  //     type: 'POST',
  //     url: '/cart/add.js',
  //     dataType: 'json',
  //     data: {
  //       quantity: 1,
  //       id: productId
  //     },
  //     success: function (response) {
  //
  //     },
  //     error: function (obj, status) {
  //       ShopifyAPI.onError(obj, status)
  //     },
  //     complete: function () {
  //       window.location.href = '/checkout?2bb_us=' + productId;
  //     }
  //   });
  // })


}


function closeModal() {
  $('#CartDrawer').attr('tabindex', '-1');
  $('#free-product-2bb-container').removeClass('active')
  $('.free-product-inner').removeClass('active')
  $('.free-product-popup h2, .free-product-popup .close-popup').off('keydown')
  $('.free-product-popup .close-popup').off('click')
  $('.free-product-content').height('80px')
  $('.free-product-inner').html('')
}


function clickModal(event) {
  event.stopPropagation();
}

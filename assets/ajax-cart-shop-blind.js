/*============================================================================
  Ajax the add to cart experience by revealing it in a side drawer
  Plugin Documentation - http://shopify.github.io/Timber/#ajax-cart
  (c) Copyright 2015 Shopify Inc. Author: Carson Shold (@cshold). All Rights Reserved.

  This file includes:
    - Basic Shopify Ajax API calls
    - Ajax cart plugin

  This requires:
    - jQuery 1.8+
    - handlebars.min.js (for cart template)
    - modernizr.min.js
    - snippet/ajax-cart-template.liquid

  Customized version of Shopify's jQuery API
  (c) Copyright 2009-2015 Shopify Inc. Author: Caroline Schnapp. All Rights Reserved.
==============================================================================*/
if ((typeof ShopifyAPI) === 'undefined') { ShopifyAPI = {}; }

/*============================================================================
  API Helper Functions
==============================================================================*/
function attributeToString(attribute) {
  if ((typeof attribute) !== 'string') {
    attribute += '';
    if (attribute === 'undefined') {
      attribute = '';
    }
  }
  return jQuery.trim(attribute);
};

/*============================================================================
  API Functions
==============================================================================*/

ShopifyAPI.onCartUpdate = function(cart) {
  //alert('There are now ' + cart.item_count + ' items in the cart.');
};

ShopifyAPI.updateCartNote = function(note, callback) {
  var $body = $(document.body),
  params = {
    type: 'POST',
    url: '/cart/update.js',
    data: 'note=' + attributeToString(note),
    dataType: 'json',
    beforeSend: function() {
      $body.trigger('beforeUpdateCartNote.ajaxCart', note);
    },
    success: function(cart) {
      if ((typeof callback) === 'function') {
        callback(cart);
      }
      else {
        ShopifyAPI.onCartUpdate(cart);
      }
      $body.trigger('afterUpdateCartNote.ajaxCart', [note, cart]);
    },
    error: function(XMLHttpRequest, textStatus) {
      $body.trigger('errorUpdateCartNote.ajaxCart', [XMLHttpRequest, textStatus]);
      ShopifyAPI.onError(XMLHttpRequest, textStatus);
    },
    complete: function(jqxhr, text) {
      $body.trigger('completeUpdateCartNote.ajaxCart', [this, jqxhr, text]);
    }
  };
  jQuery.ajax(params);
};

ShopifyAPI.onError = function(XMLHttpRequest, textStatus) {
  var data = eval('(' + XMLHttpRequest.responseText + ')');
  if (!!data.message) {
    alert(data.message + '(' + data.status  + '): ' + data.description);
  }
};

/*============================================================================
  POST to cart/add.js returns the JSON of the cart
    - Allow use of form element instead of just id
    - Allow custom error callback
==============================================================================*/
ShopifyAPI.addItemFromForm = function(form, callback, errorCallback) {
  var $body = $(document.body),
  params = {
    type: 'POST',
    url: '/cart/add.js',
    data: jQuery(form).serialize(),
    dataType: 'json',
    beforeSend: function(jqxhr, settings) {
      $body.trigger('beforeAddItem.ajaxCart', form);
    },
    success: function(line_item) {
      if ((typeof callback) === 'function') {
        callback(line_item, form);
      }
      else {
        ShopifyAPI.onItemAdded(line_item, form);
      }
      $body.trigger('afterAddItem.ajaxCart', [line_item, form]);
    },
    error: function(XMLHttpRequest, textStatus) {
      if ((typeof errorCallback) === 'function') {
        errorCallback(XMLHttpRequest, textStatus);
      }
      else {
        ShopifyAPI.onError(XMLHttpRequest, textStatus);
      }
      $body.trigger('errorAddItem.ajaxCart', [XMLHttpRequest, textStatus]);
    },
    complete: function(jqxhr, text) {
      $body.trigger('completeAddItem.ajaxCart', [this, jqxhr, text]);
    }
  };
  jQuery.ajax(params);
};

// Get from cart.js returns the cart in JSON
ShopifyAPI.getCart = function(callback) {
  $(document.body).trigger('beforeGetCart.ajaxCart');
  jQuery.getJSON('/cart.js', function (cart, textStatus) {
    if ((typeof callback) === 'function') {
      callback(cart);
    }
    else {
      ShopifyAPI.onCartUpdate(cart);
    }
    $(document.body).trigger('afterGetCart.ajaxCart', cart);
  });
};

// POST to cart/change.js returns the cart in JSON
ShopifyAPI.changeItem = function(line, quantity, callback) {
  var $body = $(document.body),
  params = {
    type: 'POST',
    url: '/cart/change.js',
    data: 'quantity=' + quantity + '&line=' + line,
    dataType: 'json',
    beforeSend: function() {
      $body.trigger('beforeChangeItem.ajaxCart', [line, quantity]);
    },
    success: function(cart) {
      if ((typeof callback) === 'function') {
        callback(cart);
      }
      else {
        ShopifyAPI.onCartUpdate(cart);
      }
      $body.trigger('afterChangeItem.ajaxCart', [line, quantity, cart]);
    },
    error: function(XMLHttpRequest, textStatus) {
      $body.trigger('errorChangeItem.ajaxCart', [XMLHttpRequest, textStatus]);
      ShopifyAPI.onError(XMLHttpRequest, textStatus);
    },
    complete: function(jqxhr, text) {
      $body.trigger('completeChangeItem.ajaxCart', [this, jqxhr, text]);
    }
  };
  jQuery.ajax(params);
};

/*============================================================================
  Ajax Shopify Add To Cart
==============================================================================*/
var ajaxCart = (function(module, $) {

  'use strict';

  // Public functions
  var init, loadCart;

  // Private general variables
  var settings, isUpdating, $body;

  // Private plugin variables
  var $formContainer, $addToCart, $cartCountSelector, $cartCostSelector, $cartContainer, $drawerContainer;

  // Private functions
  var updateCountPrice, formOverride, itemAddedCallback, itemErrorCallback, cartUpdateCallback, buildCart, cartCallback, adjustCart, adjustCartCallback, createQtySelectors, qtySelectors, validateQty;

  /*============================================================================
    Initialise the plugin and define global options
  ==============================================================================*/
  init = function (options) {

    // Default settings
    settings = {
      formSelector       : 'form[action^="/cart/add"]',
      cartContainer      : '#CartContainer',
      addToCartSelector  : 'input[type="submit"]',
      cartCountSelector  : '.cart__item-count',
      cartCostSelector   : null,
      moneyFormat        : '$',
      disableAjaxCart    : false,
      enableQtySelectors : true
    };

    // Override defaults with arguments
    $.extend(settings, options);

    // Select DOM elements
    $formContainer     = $(settings.formSelector);
    $cartContainer     = $(settings.cartContainer);
    $addToCart         = $formContainer.find(settings.addToCartSelector);
    $cartCountSelector = $(settings.cartCountSelector);
    $cartCostSelector  = $(settings.cartCostSelector);

    // Update quantity for header icon cart
    document.addEventListener('rebuy:cart.change', (event) => {
      if ($cartCountSelector[0]) $cartCountSelector[0].textContent = event.detail.cart.itemCount()
    })
    // General Selectors
    $body = $(document.body);

    // Track cart activity status
    isUpdating = false;

    // Setup ajax quantity selectors on the any template if enableQtySelectors is true
    if (settings.enableQtySelectors) {
      qtySelectors();
    }

    // Take over the add to cart form submit action if ajax enabled
    if (!settings.disableAjaxCart && $addToCart.length) {
      formOverride();
    }

    // Run this function in case we're using the quantity selector outside of the cart
    adjustCart();
  };

  loadCart = function () {
    $body.addClass('drawer--is-loading');
    ShopifyAPI.getCart(cartUpdateCallback);
  };

  updateCountPrice = function (cart) {
    if ($cartCountSelector) {
      $cartCountSelector.html(cart.item_count).removeClass('hidden-count');

      if (cart.item_count === 0) {
        $cartCountSelector.addClass('hidden-count');
      }
    }
    if ($cartCostSelector) {
      $cartCostSelector.html(Shopify.formatMoney(cart.total_price, settings.moneyFormat));
    }
  };

  formOverride = function () {
    $formContainer.on('submit', function(evt) {
      evt.preventDefault();

      // Add class to be styled if desired
      $addToCart.removeClass('is-added').addClass('is-adding');

      // Remove any previous quantity errors
      $('.qty-error').remove();

      ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback);
    });
  };

  itemAddedCallback = function (product) {
    $addToCart.removeClass('is-adding').addClass('is-added');

    ShopifyAPI.getCart(cartUpdateCallback);
  };

  itemErrorCallback = function (XMLHttpRequest, textStatus) {
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    $addToCart.removeClass('is-adding is-added');

    if (!!data.message) {
      if (data.status == 422) {
        $formContainer.after('<div class="errors qty-error">'+ data.description +'</div>')
      }
    }
  };

  cartUpdateCallback = function (cart) {
    // Update quantity and price
    updateCountPrice(cart);
    buildCart(cart);
  };

  buildCart = function (cart) {

    var motivator_ajax = function(cart){

      // Start with a fresh cart div
      $cartContainer.empty();

      // Show empty cart
      if (cart.item_count === 0) {
        $cartContainer
        .append('<p>' + "Your cart is currently empty." + '</p>');
        cartCallback(cart);
        return;
      }

      Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
          return (arg1 == arg2) ? options.inverse(this) : options.fn(this);
      });

      // Handlebars.js cart layout
      var items = [],
          filteredItems = [],
          shopBlindItems = {},
          item = {},
          data = {},
          source = $("#CartTemplate").html(),
          template = Handlebars.compile(source);

      $.each(cart.items, function(index, cartItem) {
        if ( cartItem.product_type === 'shopblind' ) {
          if ( shopBlindItems[cartItem.product_id] ) {
            // If in object, increase quantity
            shopBlindItems[cartItem.product_id].quantity += cartItem.quantity
          } else {
            // If not in object, add the item to the object
            shopBlindItems[cartItem.product_id] = cartItem
            shopBlindItems[cartItem.product_id].properties = null
            shopBlindItems[cartItem.product_id].variant_title = null
            shopBlindItems[cartItem.product_id].should_randomize = true
            shopBlindItems[cartItem.product_id].line = index
          }
        } else {
          cartItem.line = index
          filteredItems.push(cartItem)
        }
      })
      Object.keys(shopBlindItems).forEach( item_id => {
        filteredItems.push(shopBlindItems[item_id])
      })
      filteredItems.sort((a, b) => a.title.localeCompare(b.title))
      // Add each item to our handlebars.js data
      $.each(filteredItems, function(index, cartItem) {
        /* Hack to get product image thumbnail
       *   - If image is not null
       *     - Remove file extension, add _small, and re-add extension
       *     - Create server relative link
       *   - A hard-coded url of no-image
      */
        if (cartItem.image != null){
          var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1").replace('http:', '');
        } else {
          var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
        }

        // Create item's data object and add to 'items' array
        item = {
          key: cartItem.key,
          line: cartItem.line + 1, // Shopify uses a 1+ index in the API
          url: cartItem.url,
          img: prodImg,
          product_id: cartItem.product_id,
          product_type: cartItem.product_type,
          handle: cartItem.handle,
          name: cartItem.product_title,
          variation: cartItem.variant_title,
          properties: cartItem.properties,
          itemAdd: cartItem.quantity + 1,
          itemMinus: cartItem.quantity - 1,
          itemQty: cartItem.quantity,
          price: Shopify.formatMoney(cartItem.price, settings.moneyFormat),
          vendor: cartItem.vendor,
          linePrice: Shopify.formatMoney(cartItem.line_price, settings.moneyFormat),
          originalLinePrice: Shopify.formatMoney(cartItem.original_line_price, settings.moneyFormat),
          discounts: cartItem.discounts,
          discountsApplied: cartItem.line_price === cartItem.original_line_price ? false : true
        };

        items.push(item);
      });

      // Gather all cart data and add to DOM
      var freeShippingMinimum = cart.currency === 'USD' ? 95 : 99
      var cartCurrency = cart.currency == 'CAD' ? 'CAD' : ''
      data = {
        items: items,
        note: cart.note,
        freeShipping: (cart.total_price / 100) < freeShippingMinimum ? freeShippingMinimum - (cart.total_price / 100) : false,
        totalPrice: Shopify.formatMoney(cart.total_price, settings.moneyFormat) + ' ' + cartCurrency,
        totalCartDiscount: cart.total_discount === 0 ? 0 : "You're saving [savings]".replace('[savings]', Shopify.formatMoney(cart.total_discount, settings.moneyFormat)),
        totalCartDiscountApplied: cart.total_discount === 0 ? false : true
      }

      $cartContainer.append(template(data));

      cartCallback(cart);
    }

    if(typeof updateMotivator == 'function') {
      updateMotivator(cart, motivator_ajax);
    }
    else {
      motivator_ajax(cart);
    }

    if(typeof trigger_messages == 'function')
    {
      trigger_messages();
    }

    // If upsell, show upsell
    if ( $('.upsell-2bb').length ) {
      const ignoreItems = [
        '31076190388320',
        '32718193131616',
        '32718193164384',
        '32718193197152',
        '32718193229920',
        '32718193262688',
        '32718193295456',
        '32718193328224',
        '32718193360992',
        '32718193393760',
        '32718194245728',
        '32718194770016',
        '4733056155744',
        '32718148698208',
        '32718195654752',
        '32718195687520',
        '32718195720288',
        '32718195753056',
        '32718195785824',
        '32718195818592',
        '32718195851360',
        '32718195884128',
        '32718195916896'
      ]
      const upsellSeen = Cookies.get('2bb-upsell')
      if ( !upsellSeen ) {
        $('.ajaxcart').on('submit', function(e) {
          let shouldShowUpsell = false
          $.each( cart.items, function (index, item) {
            if ( ignoreItems.includes(String(item.id) ) ) {
              shouldShowUpsell = false
            }
          })
          if (shouldShowUpsell) {
            e.preventDefault()
            $('.main-content, .site-header, .site-footer, #CartDrawer').attr('aria-hidden', 'true')
            $('.main-content, .site-header, .site-footer, #CartDrawer').removeAttr('tabindex')
            $('.upsell-2bb').attr('tabindex', '-1')
            $('.upsell-2bb').addClass('active')
            $('.upsell-2bb h2').focus()
            $(document).on('keyup', function(e) {
              if (e.key === "Escape") { // escape key maps to keycode `27`
                window.location.href = '/checkout';
              }
            });
            Cookies.set('2bb-upsell', true, { expires: 1, sameSite: true });
          }
        })
      }
    }

  };

  cartCallback = function(cart) {
    $body.removeClass('drawer--is-loading');
    $body.trigger('afterCartLoad.ajaxCart', cart);

    if (window.Shopify && Shopify.StorefrontExpressButtons) {
      Shopify.StorefrontExpressButtons.initialize();
    }
  };

  adjustCart = function () {
    // Delegate all events because elements reload with the cart

    $body.on('click', '.ajaxcart__qty-remove', function() {
      $body.addClass('drawer--is-loading');
      var $el = $(this),
          productType = $el.data('product-type'),
          handle = $el.data('handle'),
          line = $el.data('line');

      updateQuantity(line, 0, productType, handle);
    });

    // Add or remove from the quantity
    $body.on('click', '.ajaxcart__qty-adjust', function() {
      if (isUpdating) {
        return;
      }

      var $el = $(this),
          line = $el.data('line'),
          productType = $el.data('product-type'),
          handle = $el.data('handle'),
          $qtySelector = $el.siblings('.ajaxcart__qty-num'),
          qty = parseInt($qtySelector.val().replace(/\D/g, ''));
          qty = validateQty(qty);

      // Add or subtract from the current quantity
      if ($el.hasClass('ajaxcart__qty--plus')) {
        qty += 1;
      } else {
        qty -= 1;
        if (qty <= 0) qty = 0;
      }

      // If it has a data-line, update the cart.
      // Otherwise, just update the input's number
      if (line) {
        updateQuantity(line, qty, productType, handle);
      } else {
        $qtySelector.val(qty);
      }
    });

    // Update quantity based on input on change
    $body.on('change', '.ajaxcart__qty-num', function() {
      if (isUpdating) {
        return;
      }

      var $el = $(this),
          line = $el.data('line'),
          productType = $el.data('product-type'),
          handle = $el.data('handle'),
          qty = parseInt($el.val().replace(/\D/g, ''));

      var qty = validateQty(qty);

      // If it has a data-line, update the cart
      if (line) {
        updateQuantity(line, qty, productType, handle);
      }
    });

    // Prevent cart from being submitted while quantities are changing
    $body.on('submit', 'form.ajaxcart', function(evt) {
      if (isUpdating) {
        evt.preventDefault();
      }
    });

    // Highlight the text when focused
    $body.on('focus', '.ajaxcart__qty-adjust', function() {
      var $el = $(this);
      setTimeout(function() {
        $el.select();
      }, 50);
    });

    function updateQuantity(line, qty, productType, handle) {
      isUpdating = true;
      // Add activity classes when changing cart quantities
      var $row = $('.ajaxcart__row[data-line="' + line + '"]').addClass('is-loading');

      if (qty === 0) {
        $row.parent().addClass('is-removed');
      }

      // Slight delay to make sure removed animation is done
      setTimeout(function() {
        if ( productType === 'shopblind' ) {

          ShopifyAPI.getCart( function (cart) {
            var request = {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json;'
              },
            }
            fetch('/products/' + handle + '.js', request)
            .then(function(response) {
              return response.json()
            })
            .then(
              function(product) {
                var availableVariants = product.variants.filter( variant => {
                  return variant.available
                })
                var updateItems = {}
                $.each(cart.items, function(index, cartItem) {
                  if ( cartItem.product_id === product.id ) {
                    updateItems[cartItem.variant_id] = 0
                  }
                })
                $.ajax({
                  type: 'POST',
                  url: '/cart/update.js',
                  data: {
                    updates: updateItems
                  },
                  dataType: 'json',
                  async:false,  // Be warned, async:false has been deprecated in jQuery for a long time and is not recommended for use. It's generally recommended to use callbacks or promises instead
                  success: function(cart){
                    if ( qty === 0 ) {
                      $.ajax({
                        type: 'GET',
                        url: '/cart.js',
                        dataType: 'json',
                        async:false,  // Be warned, async:false has been deprecated in jQuery for a long time and is not recommended for use. It's generally recommended to use callbacks or promises instead
                        success: function(cart){
                          adjustCartCallback(cart)
                          return
                        }
                      });
                    } else {
                      var addItems = []
                      for (var i = 0; i < qty; i++) {
                        var randomVariant = Math.floor(Math.random() * availableVariants.length)
                        //var currentRandomCount = addItems.items[availableVariants[randomVariant].id] || 0
                        //addItems.items[availableVariants[randomVariant].id] = currentRandomCount + 1
                        addItems.push({
                          id: availableVariants[randomVariant].id,
                          quantity: 1
                        })
                      }
                      $.ajax({
                        type: 'POST',
                        url: '/cart/add.js',
                        data: { items: addItems },
                        dataType: 'json',
                        async:false,  // Be warned, async:false has been deprecated in jQuery for a long time and is not recommended for use. It's generally recommended to use callbacks or promises instead
                        success: function(addedItems){
                          $.ajax({
                            type: 'GET',
                            url: '/cart.js',
                            dataType: 'json',
                            async:false,  // Be warned, async:false has been deprecated in jQuery for a long time and is not recommended for use. It's generally recommended to use callbacks or promises instead
                            success: function(cart){
                              adjustCartCallback(cart)
                            }
                          });
                        }
                      });
                    }
                  }
                });
              }
            )
            .catch(function(error) {
              console.log(error);
            });
          })
        } else {
          ShopifyAPI.changeItem(line, qty, adjustCartCallback);
        }
      }, 250);
    }

    // Save note anytime it's changed
    $body.on('change', 'textarea[name="note"]', function() {
      var newNote = $(this).val();

      // Update the cart note in case they don't click update/checkout
      ShopifyAPI.updateCartNote(newNote, function(cart) {});
    });
  };

  adjustCartCallback = function (cart) {
    // Update quantity and price
    updateCountPrice(cart);

    // Reprint cart on short timeout so you don't see the content being removed
    setTimeout(function() {
      isUpdating = false;
      ShopifyAPI.getCart(buildCart);
    }, 150)
  };

  createQtySelectors = function() {
    // If there is a normal quantity number field in the ajax cart, replace it with our version
    if ($('input[type="number"]', $cartContainer).length) {
      $('input[type="number"]', $cartContainer).each(function() {
        var $el = $(this),
            currentQty = $el.val();

        var itemAdd = currentQty + 1,
            itemMinus = currentQty - 1,
            itemQty = currentQty;

        var source   = $("#AjaxQty").html(),
            template = Handlebars.compile(source),
            data = {
              key: $el.data('id'),
              itemQty: itemQty,
              itemAdd: itemAdd,
              itemMinus: itemMinus
            };

        // Append new quantity selector then remove original
        $el.after(template(data)).remove();
      });
    }
  };

  qtySelectors = function() {
    // Change number inputs to JS ones, similar to ajax cart but without API integration.
    // Make sure to add the existing name and id to the new input element
    var numInputs = $('input[type="number"]');

    if (numInputs.length) {
      numInputs.each(function() {
        var $el = $(this),
            currentQty = $el.val(),
            inputName = $el.attr('name'),
            inputId = $el.attr('id');

        var itemAdd = currentQty + 1,
            itemMinus = currentQty - 1,
            itemQty = currentQty;

        var source   = $("#JsQty").html(),
            template = Handlebars.compile(source),
            data = {
              key: $el.data('id'),
              itemQty: itemQty,
              itemAdd: itemAdd,
              itemMinus: itemMinus,
              inputName: inputName,
              inputId: inputId
            };

        // Append new quantity selector then remove original
        $el.after(template(data)).remove();
      });

      // Setup listeners to add/subtract from the input
      $('.js-qty__adjust').on('click', function() {
        var $el = $(this),
            id = $el.data('id'),
            $qtySelector = $el.siblings('.js-qty__num'),
            qty = parseInt($qtySelector.val().replace(/\D/g, ''));

        var qty = validateQty(qty);

        // Add or subtract from the current quantity
        if ($el.hasClass('js-qty__adjust--plus')) {
          qty += 1;
        } else {
          qty -= 1;
          if (qty <= 1) qty = 1;
        }

        // Update the input's number
        $qtySelector.val(qty);
      });
    }
  };

  validateQty = function (qty) {
    if((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {
      // We have a valid number!
    } else {
      // Not a number. Default to 1.
      qty = 1;
    }
    return qty;
  };

  module = {
    init: init,
    load: loadCart
  };

  return module;

}(ajaxCart || {}, jQuery));

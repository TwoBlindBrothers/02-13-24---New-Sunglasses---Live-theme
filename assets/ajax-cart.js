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

}

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
  var $body = $(document.body)
  var productForm = jQuery(form).serialize()
  // console.log('pform', productForm)
  var params = {
    type: 'POST',
    url: '/cart/add.js',
    data: productForm,
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
      if ( $('.free-product-popup').length ) {
        freeProductPopup (line_item)
      }
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
      if ( $('.free-product-popup').length) {
        if ($('#free-product-2bb-container').hasClass("active")) {
          closeModal();
        }
      }
    }
  };
  jQuery.ajax(params);

  function freeProductPopup (lineItem) {
    jQuery.getJSON('/cart.js', function (cart, textStatus) {
      const hasPromo = cart.items.filter( item => {
        return item.product_type == 'Sock Promo'
      });
      //if (hasPromo.length > 0) {
        //Cookies.set('sockpromo', "purchased", { expires: 1, sameSite: true });
      //}
      let sockpromo = Cookies.get('sockpromo');
      if ( !$('#free-product-2bb-container').hasClass('active') && !hasPromo.length && sockpromo == 'true') {
        $('#free-product-2bb-container').addClass('active');
      }
    })
  }

};

// Get from cart.js returns the cart in JSON
ShopifyAPI.getCart = function(callback) {
  $(document.body).trigger('beforeGetCart.ajaxCart');
  jQuery.getJSON('/cart.js', function (cart, textStatus) {
    if ((typeof callback) === 'function') {
      ShopifyAPI.onCartUpdate(cart);
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
        ShopifyAPI.onCartUpdate(cart);
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
  var updateCountPrice, formOverride, itemAddedCallback, itemErrorCallback, cartUpdateCallback, buildCart, getCartRecommendations, cartCallback, adjustCart, adjustCartCallback, createQtySelectors, qtySelectors, validateQty;

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
      $cartCostSelector.html(Shopify.formatMoney(cart.total_price, settings.moneyFormat).replace('.00', ''));
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

    var motivator_ajax = function(cart) {

      // Start with a fresh cart div
      $cartContainer.empty();

      // Show empty cart
      if (cart.item_count === 0) {
        $cartContainer
        .append('<div id="cart-reqs" class="cart-reqs-collection products-grid"><div id="cart-reqs-heading" class="text-center"></div></div>');
        cartCallback(cart);
        getCartRecommendations(cart)
        return
      }

      Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
          return (arg1 == arg2) ? options.inverse(this) : options.fn(this);
      });

      Handlebars.registerHelper('ifNotHidden', function(arg1, options) {
        return (arg1.startsWith('_')) ? options.inverse(this) : options.fn(this);
      });

      Handlebars.registerHelper('ifNotSockPromo', function(arg1, options) {
          return (arg1 == 'Sock Promo') ? options.inverse(this) : options.fn(this);
      });

      Handlebars.registerHelper('ifSubscription', function(arg1, options) {
          return (arg1 == 'shipping_interval_unit_type' || arg1 == 'shipping_interval_frequency' ) ? options.fn(this) : options.inverse(this);
      });

      Handlebars.registerHelper('ifNote', function(arg1, options) {
          return (arg1 == 'NOTE') ? options.fn(this) : options.inverse(this);
      });

      Handlebars.registerHelper('ifPrepaidSubscription', function(arg1, options) {
          return (arg1 == 'charge_interval_frequency' || arg1 == 'charge_interval_unit_type' ) ? options.fn(this) : options.inverse(this);
      });

      Handlebars.registerHelper('ifChargeFrequency', function(arg1, options) {
          return (arg1 == 'prepaid') ? options.fn(this) : options.inverse(this);
      });

      Handlebars.registerHelper('ifFrequency', function(arg1, options) {
          return (arg1 == 'shipping_interval_frequency') ? options.inverse(this) : options.fn(this);
      });

      // Handlebars.js cart layout
      var items = [],
          filteredItems = [],
          shopBlindItems = {},
          item = {},
          data = {},
          noSubscription = true,
          hasSubItems = false,
          source = $("#CartTemplate").html(),
          template = Handlebars.compile(source);
      function arrayEquals(a, b) {
        return Array.isArray(a) &&
          Array.isArray(b) &&
          a.length === b.length &&
          a.every((val, index) => val === b[index]);
      }
      const cartItems = cart.items
      $.each(cartItems, function(index, cartItem) {
        var applicableOptions = cartItem.options_with_values ? cartItem.options_with_values.filter( option => {
          return option.name.toLowerCase() === 'option'
        })
        : []
        if ( cartItem.product_type === 'subscription' ) {
          noSubscription = false
          hasSubItems = true
        }
        if ( cartItem.product_type === 'shopblind' && applicableOptions.length ) {
          var optionsLessVariableOption = cartItem.options_with_values.filter( option => {
            return option.name.toLowerCase() !== 'option' && option.name.toLowerCase() !== 'title'
          })
          optionsLessVariableOption = optionsLessVariableOption.map( option => {
            return option.value
          })
          var optionsString = cartItem.product_id + '/' + optionsLessVariableOption.join('-')
          if ( shopBlindItems[optionsString] && arrayEquals(optionsLessVariableOption, shopBlindItems[optionsString].options ) ) {
            // If in object, increase quantity
            shopBlindItems[optionsString].quantity += cartItem.quantity
          }
          if ( !shopBlindItems[optionsString] ) {
            // If not in object, add the item to the object
            shopBlindItems[optionsString] = cartItem
            shopBlindItems[optionsString].properties = null
            shopBlindItems[optionsString].variant_title = optionsLessVariableOption.join(' / ')
            shopBlindItems[optionsString].should_randomize = true
            shopBlindItems[optionsString].line = index
            shopBlindItems[optionsString].options = optionsLessVariableOption
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
      let hasPrepaidSubscription = false
      $.each(filteredItems, function(index, cartItem) {
        /* Hack to get product image thumbnail
       *   - If image is not null
       *     - Remove file extension, add _small, and re-add extension
       *     - Create server relative link
       *   - A hard-coded url of no-image
      */
        if (cartItem.image != null){
          var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_medium$1").replace('http:', '');
        } else {
          var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
        }

        $.ajax({
    			url: '/products/' + cartItem.handle + '.js',
    			dataType: 'json',
    			async: false,
    			success: function(product){
            cartItem.tags = product.tags
    				product.variants.forEach(function(variant) {
            	if (variant.id == cartItem.variant_id) {
                if (variant.compare_at_price != null) {
                  cartItem["compare_at_price"] = Shopify.formatMoney(variant.compare_at_price, settings.moneyFormat).replace('.00', '')
                } else {
                  cartItem["compare_at_price"] = false;
                }
              }
    				});
    			}
    		});

        // Create item's data object and add to 'items' array
        item = {
          key: cartItem.key,
          line: cartItem.line + 1, // Shopify uses a 1+ index in the API
          url: cartItem.url,
          img: prodImg,
          finalSale: cartItem.tags !== undefined ? cartItem.tags.includes('FINAL SALE') : false,
          compareAtPrice: cartItem.compare_at_price,
          product_id: cartItem.product_id,
          product_type: cartItem.product_type,
          handle: cartItem.handle,
          name: cartItem.product_title.replace(' Auto renew', ''),
          variation: cartItem.variant_options.length ? cartItem.variant_options[0] : '',
          properties: cartItem.properties,
          itemAdd: cartItem.quantity + 1,
          itemMinus: cartItem.quantity - 1,
          itemQty: cartItem.quantity,
          price: Shopify.formatMoney(cartItem.price, settings.moneyFormat).replace('.00', ''),
          vendor: cartItem.vendor,
          linePrice: Shopify.formatMoney(cartItem.line_price, settings.moneyFormat).replace('.00', ''),
          originalLinePrice: Shopify.formatMoney(cartItem.original_line_price, settings.moneyFormat).replace('.00', ''),
          discounts: cartItem.discounts,
          discountsApplied: cartItem.line_price === cartItem.original_line_price ? false : true
        };
        if ( cartItem.options_with_values ) {
          var optionsWithValues = cartItem.options_with_values.filter( option => {
            return option.name.toLowerCase() != 'option' && option.name.toLowerCase() !== 'title'
          })
          var options = '';
          optionsWithValues.forEach( (option, i) => {
            options += option.value
            if ( i + 1 < optionsWithValues.length ) {
              options += '/'
            }
          })
          item.options = options
        }
        if ( cartItem.selling_plan_allocation ) {
          let selling_plan = cartItem.selling_plan_allocation.selling_plan.name;
          if ( selling_plan.includes('Delivery every 1 Month') ) {
            selling_plan = 'Monthly Subscription'
          }
          item.selling_plan = selling_plan;
          if ( cartItem.selling_plan_allocation.selling_plan.name.includes('Charge every 3 Months') ) {
            item.prepay = 'Prepaid 3 months'
          }
          if ( cartItem.selling_plan_allocation.selling_plan.name.includes('Charge every 6 Months') ) {
            item.prepay = 'Prepaid 6 months'
          }
          hasPrepaidSubscription = true;
        }
        if ( cartItem.properties && cartItem.properties.charge_interval_frequency ) {
          hasPrepaidSubscription = true;
        }
        items.push(item);
      });

      // Gather all cart data and add to DOM
      var freeShippingMinimum = cart.currency === 'USD' ? 95 : 99;
      var cartCurrency = cart.currency == 'CAD' ? 'CAD' : ''
      var cartSavingsHtml = "You're saving [savings]";
      data = {
        items: items,
        note: cart.note,
        freeShipping: (cart.total_price / 100) < freeShippingMinimum ? freeShippingMinimum - (cart.total_price / 100) : false,
        totalPrice: Shopify.formatMoney(cart.total_price, settings.moneyFormat).replace('.00', '') + ' ' + cartCurrency,
        totalCartDiscount: cart.total_discount === 0 ? 0 : cartSavingsHtml.replace('[savings]', Shopify.formatMoney(cart.total_discount, settings.moneyFormat).replace('.00', '')),
        totalCartDiscountApplied: cart.total_discount === 0 ? false : true,
        noSubscription: noSubscription,
        hasSubcription: hasSubItems
      }

      // If any items are subscription items, apply free shipping. Shipping is handled by ReCharge
      if ( hasPrepaidSubscription ) {
        data.freeShipping = 0;
      }

      $cartContainer.append(template(data));    
      getCartRecommendations(cart)
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
    const shouldShowUpsellToggle = false
    if ( $('.upsell-2bb').length && Cookies.get('sockpromo') == undefined && shouldShowUpsellToggle ) {
      let ignoreItems = [

      ]
      $('.upsell-product-id').each( function () {
        ignoreItems.push($(this).data('upsell-variant-id').toString())
      })

      let upsellSeen = Cookies.get('2bb-upsell')
      // Remove to enable
      // upsellSeen = true;

      //let titleQuery = 'title:'
      //$.each( cart.items, function (index, item) {
      //  const appendOr = index !== (cart.items.length - 1) ? ' OR title: ' : ''
      //  titleQuery += item.title + appendOr
      //})
      $.each( cart.items, function (index, item) {
        const productQuery = `
          {
            product(id: "gid://shopify/Product/${item.product_id}") {
              title
              variants(first: 200) {
                edges {
                  node {
                    sku
                    metafield(key: "variants_included", namespace: "shop_blind") {
                      value
                    }
                  }
                }
              }
            }
          }`;
        const productPromise = new Promise( resolve => {
          fetch('https://two-blind-brothers.myshopify.com/api/2021-10/graphql.json', {
            'async': true,
            'crossDomain': true,
            'method': 'POST',
            'headers': {
              'X-Shopify-Storefront-Access-Token': '96b1c5f541c3e3937f6a0ced08f1f6cf',
              'Content-Type': 'application/graphql'
            },
            'body': productQuery
          })
          .then(res => res.json())
          .then(results => {
            if ( results.data.product && results.data.product.variants.edges.length ) {
              $.each(results.data.product.variants.edges, function (index, variant){
                if ( variant.node.sku == item.sku && variant.node.metafield && variant.node.metafield.value ) {
                  const includedVariants = variant.node.metafield.value.split('|')
                  $.each( includedVariants, function (i, includedVar) {
                    const includedVarId = includedVar.split(':')[1]
                    if ( ignoreItems && ignoreItems.includes(includedVarId) ) {
                      ignoreItems.push(item.id.toString())
                    }
                  })
                }
              })
            }
          })
        })
      })
      if ( upsellSeen === undefined ) {
        $('.ajaxcart').on('submit', function(e) {
          displayUpsellPopup(e)
        })

        let additionalPaymentButtons = 0
        let addedFakeButtons = false;
        const observer = new MutationObserver(function(mutations_list) {
        	mutations_list.forEach(function(mutation) {
                additionalPaymentButtons++
        	});
            if ( additionalPaymentButtons >= 3 && !addedFakeButtons) {
                $('#dynamic-checkout-cart ul li').each( function (i) {
                    $(this).addClass('inactive')
                    $(this).append(`<button class="fake-alt-button" data-alt-index="${i}"></button>`)
                })
                $('.fake-alt-button').on('click', function () {
                    $('.upsell-popup').data('alt-index', $(this).data('alt-index'))
                    displayUpsellPopup(false)
                    $('#dynamic-checkout-cart ul li').removeClass('inactive')
                })
                addedFakeButtons = true
            }
        });

        let shouldHideAltPayments = true
        $.each( cart.items, function (index, item) {
          if ( ignoreItems && ignoreItems.includes(String(item.id) ) ) {
            shouldHideAltPayments = false
          }
        })

        if ( shouldHideAltPayments ) {
            observer.observe(document.querySelector("#additional_checkout_buttons"), { subtree: true, childList: true });
        }

        function displayUpsellPopup (e) {
            let shouldShowUpsell = true
            $.each( cart.items, function (index, item) {
              if ( ignoreItems && ignoreItems.includes(String(item.id) ) ) {
                shouldShowUpsell = false
              }
            })
            if (shouldShowUpsell) {
                if ( e ) {
                    e.preventDefault()
                }
              $('.main-content, .site-header, .site-footer, #CartDrawer').attr('aria-hidden', 'true')
              $('.main-content, .site-header, .site-footer, #CartDrawer').removeAttr('tabindex')
              $('.upsell-2bb').attr('tabindex', '-1')
              $('.upsell-2bb').addClass('active')
              $('.upsell-2bb h2').focus()
              $(document).on('keyup', function(e) {
                if (e.key === "Escape") { // escape key maps to keycode `27`
                    if ( $('.upsell-popup').data('alt-index') === undefined ) {
                        window.location.href = '/checkout';
                    } else {
                          $('#dynamic-checkout-cart ul li').eq($('.upsell-popup').data('alt-index')).find('[role="button"],button').click()
                    }
                }
              });
              Cookies.set('2bb-upsell', true, { expires: 1, sameSite: true });
            } else {
                window.location.href = '/checkout';
            }
        }
      }
    }

  };

  getCartRecommendations = function(cart) {
    fetch(`/cart?view=recommendations`, {
      method: 'GET',
      headers: {
          'Content-Type': 'text/html'
      }
    })
    .then( response => response.text() )
    .then( data => { 
      const itemHandles = cart.items.map( item => item.handle )
      const recommendations = $(data).find('#cart-data').text()
      const recsObj = JSON.parse(recommendations)
      let reqsArr = recsObj.recommendations
      const { reqsHeading, reqsHeadingEmpty, reqsText } = recsObj
      const reqsLimit = itemHandles.length ? 3 : 4
      let reqsCount = 0
      let reqPromises = []
      reqsArr = reqsArr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
      reqsArr.forEach( req => {
        if ( reqsCount >= reqsLimit ) return;
        if ( !itemHandles.includes(req) ) {
          const reqPromise = new Promise((resolve, reject) => {
            try {
                fetch(`/products/${req}?view=cart-req`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'text/html'
                  }
                })
                .then( response => response.text() )
                .then( data => { 
                    if ( data !== '' && !data.includes('DOCTYPE HTML PUBLIC') ) {
                        resolve(data)
                    } else {
                        resolve(null)
                    }
                })
                .catch( error => {
                    console.error('THE ERROR', error)
                })
            }
            catch(e) {
                console.error('THE ERROR', e)
            }
          })
          reqPromises.push(reqPromise)
          reqsCount++
        }
      })
      Promise.all(reqPromises).then( products => {
        $('#cart-reqs .grid__item').remove()
        $.each(products, (index, product) => {
          $('#cart-reqs').append(product)
        })
        if ( $('#cart-reqs .grid__item').length ) {
            $('#cart-reqs-heading').html('')
          $('#cart-reqs').show()
          if ( reqsHeading && cart.items.length ) {
            $('#cart-reqs-heading').append(`<h3 class="uppercase" style="margin-bottom: 1.5rem;">${reqsHeading}</h3>`)
          }
          if ( reqsHeadingEmpty && !cart.items.length ) {
            $('#cart-reqs-heading').append(`<h3 class="uppercase">${reqsHeadingEmpty}</h3>`)
          }
          if ( reqsText && !cart.items.length ) {
            $('#cart-reqs-heading').append(`<p>${reqsText}</p>`)
          }
        }
      })
      // do {
        
      // }
      // while (reqsCount < reqsLimit);
    })  
  }

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
          variants = $el.data('variants'),
          line = $el.data('line'),
          qty = parseInt($el.data('qty'));
          var qty = validateQty(qty);
      updateQuantity(line, qty, 0, productType, handle, variants);
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
          variants = $el.data('variants'),
          $qtySelector = $el.siblings('.ajaxcart__qty-num'),
          qty = parseInt($qtySelector.val().replace(/\D/g, ''));
      var origQty = validateQty(qty);
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
        updateQuantity(line, origQty, qty, productType, handle, variants);
      } else {
        $qtySelector.val(qty);
      }
    });

    // Update quantity based on input on change
    $body.on('focusin', '.ajaxcart__qty-num', function(){
      $(this).data('val', $(this).val());
    });
    $body.on('change', '.ajaxcart__qty-num', function() {
      if (isUpdating) {
        return;
      }

      var $el = $(this),
          line = $el.data('line'),
          productType = $el.data('product-type'),
          handle = $el.data('handle'),
          variants = $el.data('variants'),
          qty = parseInt($el.val().replace(/\D/g, '')),
          origQty = $el.data('val');
          origQty = validateQty(origQty)
          qty = validateQty(qty);

      // If it has a data-line, update the cart
      if (line) {
        updateQuantity(line, origQty, qty, productType, handle, variants);
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

    function updateQuantity(line, origQty, qty, productType, handle, variants) {
      isUpdating = true;
      // Add activity classes when changing cart quantities
      var $row = $('.ajaxcart__row[data-line="' + line + '"]').addClass('is-loading');

      if (qty === 0) {
        $row.parent().addClass('is-removed');
      }
      // Slight delay to make sure removed animation is done
      setTimeout(function() {
        // if ( productType === 'shopblind' ) {
        //   var request = {
        //     method: 'GET',
        //     headers: {
        //       'Content-Type': 'application/json;'
        //     },
        //   }
        //   fetch('/products/' + handle + '.js', request)
        //   .then(function(response) {
        //     return response.json()
        //   })
        //   .then(function(product) {
        //     if ( product.variants.length ) {
        //       ShopifyAPI.getCart( function (cart) {
        //         var availableVariants = product.variants.filter( variant => {
        //           return variant.available == true
        //         })
        //         //availableVariants.forEach( vara => console.log(vara))
        //         var updateItems = {}
        //         var productsToAdd = []
        //         if ( qty < origQty ) { // Customer removed items
        //           let qtyDiff = origQty - qty
        //           $.each(cart.items, function(index, cartItem) {
        //             let cartItemQty = cartItem.quantity + 1
        //             // Loop through based on quantity. This isn't great because it removes all instances of one product first before moving on to the next.
        //             if (qtyDiff > 0) {  // note: 0 is falsy
        //                 var currentOptions = variants.toString().split(' / ') == '' ? [] : variants.toString().split(' / ')

        //                 var cartItemOptions = cartItem.options_with_values.filter( option => {
        //                   return option.name.toLowerCase() !== 'option' && option.name.toLowerCase() !== 'title'
        //                 })

        //                 const matchedOptions = cartItemOptions.filter( option => {
        //                   return currentOptions.includes(option.value)
        //                 })
                        
        //                 if ( cartItem.product_id === product.id && matchedOptions.length === cartItemOptions.length ) {
        //                   updateItems[cartItem.variant_id] = updateItems[cartItem.variant_id] !== undefined
        //                     ? updateItems[cartItem.variant_id] - 1
        //                     : (cartItem.quantity - 1)
        //                   qtyDiff--
        //                 }
        //              }
        //              if ( qty == 0 ) {
        //                if ( cartItem.product_id === product.id ) {
        //                  updateItems[cartItem.variant_id] = 0
        //                }
        //              }
        //           })
        //         } else { // Increased count
        //           let qtyDiff = qty - origQty + 1
        //           var variantsInCart = []
        //           var currentOptions = variants.toString().split(' / ') == '' ? [] : variants.toString().split(' / ')
        //           // console.log('currentOptions', currentOptions)
        //           let availableVariants = currentOptions.length
        //             ? product.variants.filter(variant => {
                        
        //                 const matchedOptions = variant.options.filter( option => {
        //                   if ( product.options.length === 1 && product.options[0].name === 'OPTION' ) {
        //                     return true
        //                   } else {
        //                     return currentOptions.includes(option)
        //                   }
        //                 })
        //                 return variant.available && matchedOptions.length === currentOptions.length
        //               })
        //             : product.variants.filter(variant => {
        //               return variant.available
        //             })
        //           availableVariants = availableVariants.map( variant => {
        //             return variant.id
        //           })
        //           if ( availableVariants.length ) {
        //             $.each(cart.items, function(index, cartItem) {
        //               if ( cartItem.product_id === product.id ) {

        //                 // if ( product.variants.length > 1 ) {
        //                 //   // console.log('if ( product.variants )', product.variants)
        //                 //   if (
        //                 //     availableVariants.includes(cartItem.variant_id) &&
        //                 //     variantsInCart.includes(cartItem.product_id) ) {
        //                 //     variantsInCart.push(cartItem.variant_id)
        //                 //   }
        //                 // } else {
        //                 //   updateItems[cartItem.variant_id] = 0
        //                 // }
        //                 updateItems[cartItem.variant_id] = 0
        //               }
        //             })
        //             let addVariantsArray = []
        //             for( var i = 0; i < qty; i++ ) {
        //               const itemIndex = i % availableVariants.length
        //               addVariantsArray.push(availableVariants[itemIndex])
        //             }
        //             // Find matching variants
        //             addVariantsArray.sort();
        //             const variantGroups = addVariantsArray.reduce((r, v, i, a) => {
        //               if (v === a[i - 1]) {
        //                   r[r.length - 1].push(v);
        //               } else {
        //                   r.push(v === a[i + 1] ? [v] : v);
        //               }
        //               return r;
        //             }, []);

        //             productsToAdd = variantGroups.map( group => {
        //               return {
        //                 id: group.constructor === Array ? group[0] : group,
        //                 quantity: group.constructor === Array ? group.length : 1,
        //                 properties: {
        //                   '_shopblind': 'true'
        //                 }
        //               }
        //             })
        //             // while (--qtyDiff) {  // note: 0 is falsy
        //             //   (function(){
        //             //     if ( variantsInCart.length < availableVariants.length ) {
        //             //       productsToAdd.push({
        //             //         id: availableVariants[variantsInCart.length],
        //             //         quantity: 1,
        //             //         properties: {
        //             //           '_shopblind': 'true'
        //             //         }
        //             //       })
        //             //       variantsInCart.push(availableVariants[variantsInCart.length])
        //             //     } else {
        //             //       var randomVariant = Math.floor(Math.random() * availableVariants.length)
        //             //       productsToAdd.push({
        //             //         id: availableVariants[randomVariant],
        //             //         quantity: 1,
        //             //         properties: {
        //             //           '_shopblind': 'true'
        //             //         }
        //             //       })
        //             //     }
        //             //   })(qtyDiff);
        //             // }
        //             // add_new_items(productsToAdd)
        //           } else {
        //             ShopifyAPI.changeItem(line, qty, adjustCartCallback);
        //           }
        //         }
        //         if ( updateItems ) {
        //             $.ajax({
        //               type: 'POST',
        //               url: '/cart/update.js',
        //               data: {
        //                 updates: updateItems
        //               },
        //               dataType: 'json',
        //               async:false,  // Be warned, async:false has been deprecated in jQuery for a long time and is not recommended for use. It's generally recommended to use callbacks or promises instead
        //               success: function(newCart){
        //                 $.ajax({
        //                   type: 'GET',
        //                   url: '/cart.js',
        //                   dataType: 'json',
        //                   async:false,  // Be warned, async:false has been deprecated in jQuery for a long time and is not recommended for use. It's generally recommended to use callbacks or promises instead
        //                   success: function(cart){
        //                     // Check for sock promo is only one item.
        //                     if ( cart.item_count == 1 ) {
        //                       if ( cart.items[0].product_type == 'Sock Promo' ) {
        //                         const removeFreeItem = {}
        //                         removeFreeItem[cart.items[0].variant_id] = 0
        //                         $.ajax({
        //                           type: 'POST',
        //                           url: '/cart/update.js',
        //                           data: {
        //                             updates: removeFreeItem
        //                           },
        //                           dataType: 'json',
        //                           async:false,  // Be warned, async:false has been deprecated in jQuery for a long time and is not recommended for use. It's generally recommended to use callbacks or promises instead
        //                           success: function(newCart){
        //                             adjustCartCallback(newCart)
        //                             return
        //                           },
        //                           error: function(xhr, ajaxOptions, thrownError) {
        //                             console.log(xhr, ajaxOptions,thrownError)
        //                           }
        //                         })
        //                       } else {
        //                         adjustCartCallback(cart)
        //                         return
        //                       }
        //                     } else {
        //                       if ( productsToAdd.length ) {
        //                         add_new_items(productsToAdd)
        //                         // adjustCartCallback(cart)
        //                       } else {
        //                         adjustCartCallback(cart)
        //                       }
        //                       return
        //                     }
        //                   }
        //                 });
        //               },
        //               error: function(xhr, ajaxOptions, thrownError) {
        //                 console.log(xhr, ajaxOptions,thrownError)
        //               }
        //             })
        //           } else {
        //             ShopifyAPI.changeItem(line, qty, adjustCartCallback);
        //           }
        //       })
        //     } else {
        //       ShopifyAPI.changeItem(line, qty, adjustCartCallback);
        //     }

        //   })
        //   .catch(function(error) {
        //     ShopifyAPI.changeItem(line, 0, adjustCartCallback);
        //   });
        // } else {
          ShopifyAPI.changeItem(line, qty, adjustCartCallback);
        // }
      }, 250);
    }

    function add_new_items(newItems) {
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: { items: newItems },
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
        },
        error: function(XMLHttpRequest, textStatus) {
          $body.trigger('errorChangeItem.ajaxCart', [XMLHttpRequest, textStatus]);
          ShopifyAPI.onError(XMLHttpRequest, textStatus);
        },
      });
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



  $.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results) {
      return results[1] || 0;
    } else {
      return null;
    }
  }

  $(document).ready(function() {
    if ( $('.free-product-2bb').length ) {
      let utm_customname = $.urlParam('utm_customname');
      if (utm_customname && utm_customname == 'stpatrickcampaign') {
        let sockpromo = Cookies.get('sockpromo');
        if (sockpromo != 'purchased') {
          var timeToAdd = 1000 * 60 * 60 * 24;
          var date = new Date();
          var expiryTime = parseInt(date.getTime()) + timeToAdd;
          date.setTime(expiryTime);
          var utcTime = date.toUTCString();
          if ( $('.free-product-2bb').data('expire-cookie') ) {
            utcTime = $('.free-product-2bb').data('expire-cookie')
          }
          document.cookie = `sockpromo=true;sameSite=true;expires=${utcTime};path=/`
        }
      }
    }
  });

  module = {
    init: init,
    load: loadCart
  };
  return module;

}(ajaxCart || {}, jQuery));

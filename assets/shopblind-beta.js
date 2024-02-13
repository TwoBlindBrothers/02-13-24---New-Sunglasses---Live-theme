var _learnq = _learnq || [];
class ShopBlindProduct {

  constructor (product) {
    this.product = product
    this.options = this.getProductOptions()
    this.variantIds = this.getVariantIds()
    this.createProduct()
  }

  getProductOptions () {
    return this.product.options.map( (product_option, index) => {
      const option = {
        name: product_option,
        values: []
      }
      this.product.variants.forEach( variant => {
        if ( !option.values.includes( variant['option' + (index + 1)]) ) {
          option.values.push(variant['option' + (index + 1)])
        }
      })
      return option
    })
  }

  getVariantIds () {
    return this.product.variants.map( variant => {
      return variant.id
    })
  }

  createProduct () {
    var productEl = document.createElement('form')
        productEl.className = 'grid__item shopblind_prod'
    var productPrice = document.createElement('span', { tabindex: '0' })
        productPrice.className = 'h1'
        productPrice.innerHTML = this.product.price
        productEl.appendChild(productPrice)
    var productSubmit = document.createElement('input')
        productSubmit.setAttribute('type', 'submit')
        productSubmit.value = this.product.available ? 'Add To Cart' : 'Sold Out'
        productSubmit.className = 'btn btn--xlarge'
        if ( !this.product.available ) {
          productSubmit.setAttribute('disabled')
        }
    this.addToCart = function(event) {
      this.addProductToCart(event);
    }.bind(this);
        productEl.addEventListener( 'submit', this.addToCart )
        productEl.appendChild(productSubmit)
    var shopBlindGrid = document.getElementById('shop-blind-grid')
    this.product_el = productEl
        shopBlindGrid.appendChild(this.product_el)
  }

  addProductToCart (evt) {
    evt.preventDefault()
    var productId = this.product.id
    this.checkCartForRedundancies().then( variantId => {
      var postData = {
        quantity: 1,
        id: variantId,
        properties: {
          _shop_blind_id: productId
        }
      }
      fetch('/cart/add.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if (json.status && json.status !== 200) {
          var error = new Error(json.description);
          error.isFromServer = true;
          throw error;
        }
        var cartSlide = document.querySelector('.js-drawer-open-right')
            cartSlide.click()
            return
      })
      .catch(function(error) {
        console.log(error)
        ShopifyAPI.onError(obj, status)
      })
    })
  }

  checkCartForRedundancies () {
    var product = this.product
    var variantIds = this.variantIds
    var mutableVariantIds = this.variantIds
    return fetch('/cart.js')
    .then(function(response) {
      return response.json();
    })
    .then(function(cart) {
      var itemCount = 0
      var groupedProductIds = []
      var variantId = variantIds[0]
      cart.items.forEach( item => {
        // item.properties && ... Switch to if product type == shopblind
        if ( item.product_id === product.id && groupedProductIds.includes(item.id) ) {
          var index = mutableVariantIds.indexOf(item.id)
          mutableVariantIds.splice(index, 1)
        }
      })
      // If all of the options are already in the cart, choose another one at random.
      if ( groupedProductIds.length === variantIds.length ) {
        var randomVariant = Math.floor(Math.random() * variantIds.length)
        variantId = variantIds[randomVariant]
      } else {
        var randomVariant = Math.floor(Math.random() * mutableVariantIds.length)
        variantId = mutableVariantIds[randomVariant]
      }
      return variantId
    })
    .catch(function(error) {
      // eslint-disable-next-line no-console
      console.log(error);
    });
  }
}

shopBlindProducts.forEach( product => {
  new ShopBlindProduct(product)
})

$('.shopblind_prod').each(function() {
  const $product = this
  const productHandle = $($product).data('handle')
    $.getJSON(`/products/${productHandle}.json`, function(product) {
      //const variants = []
      //_learnq.push(['track', 'Added to Cart', product]);
      // Check if there is inventory
      let isAvailable = false
      isAvailable = product.product.variants.filter( variant => {
        const available = variant.inventory_quantity || variant.inventory_policy === 'continue'
        return available
      })
      // If product is not available, abort
      if ( !isAvailable.length ) {
        return;
      }

      const productOptions = []
      let hasRandomizedOption = false
      product.product.options.map( option => {
        if ( option.name != 'Title') {
          productOptions.push(option.name)
        }
        if ( option.name === 'Pick a Number.' || option.name === 'Color' || option.name.toLowerCase() === 'option' ) {
          hasRandomizedOption = true
        }
        // if ( option.name.toLowerCase().indexOf("size") !== -1 ) {
        //   $('.default-one-size', $product).hide()
        // }
        if ( option.name.toLowerCase().indexOf("shopping for") !== -1 || option.name.toLowerCase().indexOf("color") !== -1 ) {
          $('.fake-select', $product).hide()
        }
      })

      let $buyButtonContainer = $('.sb-buy-button-container', $product)
      if ( productOptions.length ) {
        $($product).addClass('has-options')
        $('.toggle-sb-options', $product).attr('tabindex', '0')
        $('.toggle-sb-options', $product).on('click', function () {
          $('.toggle-sb-options', $product).attr('aria-pressed', true)
          $($product).addClass('show-options')
          $('.product-options', $product).attr('tabindex', '-1')
          $('.product-options', $product).trigger('focus')
          triggerKlaviyoViewedProduct(product)
        })
        $('.toggle-sb-options', $product).on('keydown', function (event) {
          if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
            $('.toggle-sb-options', $product).attr('aria-pressed', true)
            $($product).addClass('show-options')
            $('.product-options', $product).attr('tabindex', '-1')
            $('.product-options', $product).trigger('focus')
            triggerKlaviyoViewedProduct(product)
          }
        })
        $('.close-product-options', $product).on('click', function () {
          $($product).removeClass('show-options')
          $('.toggle-sb-options', $product).attr('aria-pressed', false)
        })



//         $(document).keyup(function(e) {
//           if (e.key === "Escape") { // escape key maps to keycode `27`
//             if ( $('.sb-product-size-chart', $product).hasClass('active') ) {
//               $('.sb-product-size-chart', $product).removeClass('active')
//             } else if ( $($product).hasClass('show-options') ) {
//               $($product).removeClass('show-options')
//               $('.toggle-sb-options', $product).attr('aria-pressed', false)
//             }
//           }
//         });
        appendProductOptions(product, $product, hasRandomizedOption)
        $buyButtonContainer = $('.product-options', $product)
      }

      $($buyButtonContainer).append(`
        <a id="addToCart-${product.product.id}" tabindex="0" class="btn btn--xlarge add-to-cart" href="#">
          Add To Cart
        </a>
      `)

      handleAddToCart( product, $product, hasRandomizedOption )

      $('.product-options .add-to-cart', $product).on('keydown', function(e) {
        if ( e.keyCode === 9 && !e.shiftKey ) {
          e.preventDefault()
          $($product).find('select:visible:first').trigger('focus')
        }
      })
      $('select', $product).on('keydown', function(e) {
        const firstVisible = $('select:visible:first', $product).index()
        if ( e.keyCode === 9 && e.shiftKey && $(this).index() === firstVisible ) {
          e.preventDefault()
          $($product).find('.product-options .add-to-cart').trigger('focus')
        }
      })

    })
})


function appendProductOptions( product, $product, hasRandomizedOption ) {
  product.product.options.map( (option, index) => {
    var selectList = document.createElement("select")
    selectList.id = option.id
    selectList.className = option.name === 'Pick a Number.' || option.name === 'Color' ? 'sb-option-select hidden' : 'sb-option-select visible'
    selectList.setAttribute('product-index', index)

    //Create default option
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true
    defaultOption.selected = true
    defaultOption.text = option.name
    selectList.appendChild(defaultOption);

    //Create and append the options
    const optionsArray = option.values.filter( value => {
      return value === 'XS'
    })
    option.values.forEach( value => {
      if ( value !== 'XS' ) {
        optionsArray.push(value)
      }
    })
    optionsArray.map( value => {
      var choice = document.createElement("option");
      choice.value = value;
      choice.text = value;
      selectList.appendChild(choice);
    })
    $('.product-options', $product).append(selectList)
  })


  // Check for options that are sold out
  $('.sb-option-select', $product).each( function(index, select) {
    for (i = 0; i < select.options.length; i++) {
      if ( !select.options[i].disabled ) {
        select.options[i].hidden = true
      }
      // select.options[i].hidden = index > selectIndex ? true : false
      const selectVal = select.options[i].value
      product.product.variants.forEach( variant => {
        if ( variant[`option${index + 1}`] === selectVal && ( variant.inventory_quantity > 0 || variant.inventory_policy === 'continue' ) ) {
          select.options[i].hidden = false
        }
      })
    }
  })

  // Add size chart if there is body content
  if ( product.product.body_html !== '' ) {
    $('.product-options', $product).append(`
      <a class="sb-size-chart-popup-link" href="#size-chart">View Sizing Chart</a>
      <div class="sb-product-size-chart" aria-modal="true">
        <div class="table-container">
          <div class="close-size-chart"><span>Close</span></div>
          <div class="tables">
            ${product.product.body_html}
          </div>
        </div>
      </div>
    `)
    $('.sb-size-chart-popup-link', $product).on('click', function(e) {
      e.preventDefault()
      $('.sb-product-size-chart', $product).addClass('active').attr('tabindex', '-1')
      $('.sb-product-size-chart', $product).trigger('focus')
    })
    $('.sb-product-size-chart').on('click', function() {
      $('.sb-product-size-chart').removeClass('active').removeAttr('tabindex')
    })
    $('.product-options', $product).on('keydown', function (e) {
      if ( e.key === "Escape" ) {
        if ($('.sb-product-size-chart', $product).hasClass('active')) {
        	$('.sb-product-size-chart', $product).removeClass('active').removeAttr('tabindex')
            $('.product-options', $product).focus()
      	} else if ( $($product).hasClass('show-options') ) {
          $($product).removeClass('show-options')
          $('.toggle-sb-options', $product).attr('aria-pressed', false)
          $('.product-options', $product).removeAttr('tabindex')
        }
      }
    })
  }

  handleOptionSelect( product, $product )
}

function handleOptionSelect ( product, $product ) {
  $('.sb-option-select.visible', $product).on( 'change', function(currentSelect) {
    const selectIndex = $(currentSelect.target).attr('product-index')
    const selectedOptionVals = []
    $('.sb-option-select', $product).each( function(index, select) {
      if ( index > selectIndex ) {
        select.selectedIndex = 0
      }
      const selected = $(select).find(":selected")
      if ( !selected.prop('disabled') ) {
        selectedOptionVals[`option${index + 1}`] = selected.val()
      }
    })

    // If all options are selected, enable the buy button
    if ( Object.keys(selectedOptionVals).length === $('.sb-option-select.visible', $product).length ) {
      $($product).addClass('buy-active')
    } else {
      $($product).removeClass('buy-active')
    }

    $('.sb-option-select', $product).each( function(index, select) {
      for (i = 0; i < select.options.length; i++) {
        if ( index > selectIndex ) {
          select.options[i].hidden = true
        }
        // select.options[i].hidden = index > selectIndex ? true : false
        const selectVal = select.options[i].value
        product.product.variants.forEach( variant => {
          let matchedOptions = Object.keys(selectedOptionVals).filter( selectedOption => {
            return selectedOptionVals[selectedOption] === variant[selectedOption]
          })
          if ( matchedOptions.length === Object.keys(selectedOptionVals).length && ( variant.inventory_quantity > 0 || variant.inventory_policy === 'continue' ) && variant[`option${index + 1}`] === selectVal ) {
            select.options[i].hidden = false
          }
        })
      }
    })
  })
}

function handleAddToCart ( product, $product, hasRandomizedOption ) {
  $(`#addToCart-${product.product.id}`).on('click', function(e) {
    e.preventDefault()
    const selectedOptions = []
    // let hiddenSelectIndex = false
    $('.sb-option-select', $product).each( function(index, select) {
      const selectedOption = $(this).find(":selected").val()
      selectedOptions[`option${index + 1}`] = selectedOption
      // if ( $(select).hasClass('hidden') ) {
      //   hiddenSelectIndex = index
      // }
    })

    // Pick random item if there's a randomizer
    if ( hasRandomizedOption ) {
      const productOptions = $('.sb-option-select.hidden', $product)[0].options
      const hiddenSelectIndex = parseInt($('.sb-option-select.hidden', $product).attr('product-index'))
      const availableOptions = []
      for (i = 0; i < productOptions.length; i++) {
        if ( !$(productOptions[i]).prop('hidden') ) {
          availableOptions.push(productOptions[i])
        }
      }
      const randomVariant = Math.floor(Math.random() * availableOptions.length)
      selectedOptions[`option${hiddenSelectIndex + 1}`] = availableOptions[randomVariant].value
    }

    const chosenVariant = product.product.variants.filter( variant => {
      const selectedVariants = Object.keys(selectedOptions).filter( selectedOption => {
        return selectedOptions[selectedOption] === variant[selectedOption]
      })
      return selectedVariants.length === Object.keys(selectedOptions).length
    })

    _learnq.push(['track', 'Added to Cart', product]);

    var postData = {
      quantity: 1,
      id: chosenVariant[0].id
    }
    addItemToCart(postData, $product)
  })
}

function closeProductPopup() {
  $('#product-popup-content').html()
  $('#product-popup').removeClass('active')
}

function addItemToCart(product, $product) {
  if ( $('.loading', $product).length ) {
    $('.loading', $product).show()
  }
  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    dataType: 'json',
    data: product,
    success: function (response) {
      $('.js-drawer-open-right').trigger('click');
      $($product).removeClass('show-options')
      var podcastPixel = new Image();
      podcastPixel.src="https://data.adxcel-ec2.com/pixel/?ad_log=referer&action=content&pixid=e503aefe-73f2-46f2-8010-e12740208050";
      return
    },
    error: function (obj, status) {
      ShopifyAPI.onError(obj, status)
    },
    complete: function (result) {
      if ( $('.loading', $product).length ) {
        $('.loading', $product).hide()
      }
      // const newCartCount = parseInt($('.cart__item-count').html()) + 1
      // $('.cart__item-count').html(newCartCount);
      $('.sb-option-select', $product).each( function(index, select) {
        select.selectedIndex = 0
      })
    }
  });
}

function triggerKlaviyoViewedProduct (product) {
  var _learnq = _learnq || [];

  var item = {
    Name: product.product.title,
    ProductID: product.product.id,
    Categories: [product.product.product_type],
    ImageURL: product.product.images[0].src,
    URL: "https://twoblindbrothers.com",
    Brand: product.product.vendor,
    Price: product.product.variants[0].price,
    CompareAtPrice: product.product.variants[0].compare_at_price
  };

  _learnq.push(['track', 'Viewed Product', item]);
  _learnq.push(['trackViewedItem', {
    Title: item.Name,
    ItemId: item.ProductID,
    Categories: item.Categories,
    ImageUrl: item.ImageURL,
    Url: item.URL,
    Metadata: {
      Brand: item.Brand,
      Price: item.Price,
      CompareAtPrice: item.CompareAtPrice
    }
  }]);
}

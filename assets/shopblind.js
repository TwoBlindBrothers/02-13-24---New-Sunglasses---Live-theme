function handleSelectOptionChange(select, productId) {
    const product = shopBlindProducts.filter( sbProduct => sbProduct.id.toString() === productId.toString() )[0]
    const productVariants = product.variants
    let availableOptions = []
    $(`#product-options-wrapper-${productId} .product-options-select`).each( (s, optSel) => {
      availableOptions.push($(optSel).val())
    })
  
    const currentIndex = $(select).data('select-index')
    let selectedOptions = []
    
    $(`#product-options-wrapper-${productId} #option-select-error-${currentIndex}`).hide()
    // Get all options selected at or above the current selector
    for ( let i = 1; i <= currentIndex; i++ ) {
        selectedOptions.push($(`#select-${productId}-${i}`).val())
    }
  
    $(select).parent().find('.product-options-select').each( (selIndex, selectOption) => {
        const selectIndex = $(selectOption).data('select-index')
        if ( selectIndex > currentIndex ) {
            $('option', selectOption).each( (o, option) => {
                if ( o === 0 ) return
                const optionText = $(option).text().trim()
                const optionsArr = selectedOptions.concat(optionText)
                let shouldShowOption = false
                productVariants.forEach( variant => {
                    if ( JSON.stringify(variant.options) == JSON.stringify(optionsArr) ) {
                        shouldShowOption = true
                    }
                })
                if ( !shouldShowOption ) {
                    //$(option).attr('disabled', !shouldShowOption)
                    $(option).hide()
                } else {
                    $(option).show()
                }
            })
        }
        if ( selIndex + 1 > currentIndex ) {
            $(`#select-${productId}-${selIndex + 1} option:first-of-type`).prop("selected", true).trigger('change');
        }
    })

    var id = '';
    productVariants.forEach( variant => {
      if ( JSON.stringify(variant.options) === JSON.stringify(availableOptions) ) {
        id = variant.id;
      }
    })

    if (!id) {
      // Rondomize variant
      var availableVariants = productVariants.filter(
        variant => variant.options.some(option => availableOptions.filter(option => !!option).indexOf(option) >= 0)
      )
      if (availableVariants.length > 0) {
        var random = Math.floor(Math.random() * (availableVariants.length - 1)) + 1
        id = availableVariants[random].id
      }
    }

    const selectVal = document.getElementById(`product-select-${productId}`)
    if (id == '') {
      // Variant Not Found / Unavailable
      selectVal.value = '';
      // Disable Add To Cart Button Here
    } else if ($(`#product-select-${productId} option[value="${id}"]`).prop('disabled') == true) {
      // Sold Out
      selectVal.value = id;
      // Disable Add To Cart Button Here			
    } else {
      selectVal.value = id;
      // Enable Add To Cart Button Here
    }
}
  
  // $('.shop-blind-form').on('submit', function (e) {
  //   e.preventDefault()
  //   if ( !$(this).data('has-options') ) {
  //     const selectedVariant = $(this).data('variant')
  //     addItemToCart(e, selectedVariant)
  //   }
  // })
  
  // $('.product-options-form').on('submit', e => {
  //   e.preventDefault()
  //   let shouldSubmit = true
  //   $('.product-options-select', e.target).each( ( i, select ) => {
  //     if ( $(select).val() === null ) {
  //       $(`#option-select-error-${i}`).show()
  //       shouldSubmit = false
  //     }
  //   })
  //   if ( shouldSubmit ) {
  //     const selectedVariant = $('.product-select', e.target).val()
  //     addItemToCart(e, selectedVariant)
  //   }
  //   // product-select
  // })

  
  var boxAnimations = {}

  const playAnimation = animation => {
    boxAnimations[animation].goToAndPlay(24, true)
    boxAnimations[animation].addEventListener('complete', function() {
      boxAnimations[animation].playSegments([
        90, 241
      ], true)
    })
  }

  const stopAnimation = animation => {
    boxAnimations[animation].resetSegments([
      0, 241
    ], true)
    boxAnimations[animation].goToAndStop(0, true)
  }

  const loadBoxAnimation = () => {
    var slides = document.getElementsByClassName("shopblind_prod");
    for (var i = 0; i < slides.length; i++) {
      var animationContainer = slides.item(i).getElementsByClassName("box-animation")[0]
      var boxAnimation = bodymovin.loadAnimation({
        container: animationContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: shopBlindBoxJson
      })

      boxAnimations[`box-animation-${i}`] = boxAnimation

      $(slides.item(i)).data('box-animation', `box-animation-${i}`)

      $(slides.item(i)).hover(function() {
        const animationIndex = $(this).data('box-animation')
        if (activeAnimation) {
          stopAnimation(activeAnimation)
        }
        activeAnimation = animationIndex
        playAnimation(animationIndex)
      }, function() {
        const animationIndex = $(this).data('box-animation')
        stopAnimation(animationIndex)
      })
    }
    if ($(window).width() < 1200) {
      const animationIndex = $('.shop-blind-carousel .slick-current').data('box-animation')
      activeAnimation = animationIndex

      playAnimation(animationIndex)
    }
  }

  var productsSlickObj = {
    arrows: true,
    centerMode: true,
    dots: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: $('.shop-blind-carousel .arrow-left'),
    nextArrow: $('.shop-blind-carousel .arrow-right'),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3
        }
      }, {
        breakpoint: 900,
        settings: {
          centerPadding: '30vw',
          slidesToShow: 1
        }
      }, {
        breakpoint: 680,
        settings: {
            centerPadding: '60px',
            slidesToShow: 1
        }
      }
    ]
  }

  let activeAnimation = null
  $(document).ready( function () {
    // loadBoxAnimation()
  })
  $('#shop-blind-products-carousel').on('init', function() {
    var slides = document.getElementsByClassName("shopblind_prod");
    if ( slides.length > 4 ) {
        this.slider.slickGoTo(0);
    }
    loadBoxAnimation()
  }).slick(productsSlickObj).on('afterChange', function(slick, currentSlide) {
    if ($(window).width() < 1200) {
      if (activeAnimation) {
        stopAnimation(activeAnimation)
      }

      const animationIndex = $('.shop-blind-carousel .slick-current').data('box-animation')
      activeAnimation = animationIndex
      playAnimation(animationIndex)
    }
  });
  
  const addItemToCart = (e, selectedVariant) => {
    const buttonLabel = $('[type="submit"]', e.target).val()
    $('[type="submit"]', e.target).addClass('loading').val('Adding To Cart')
    var payload = {
      quantity: 1,
      id: selectedVariant,
      properties: {
        '_shopblind': 'true'
      }
    }
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      dataType: 'json',
      data: payload,
      success: function (response) {
        $('.js-drawer-open-right').trigger('click')
        setTimeout( function () {
          $('[type="submit"]', e.target).removeClass('loading').val(buttonLabel)
          if ( !$(e.target).data('has-options') ) {
            $('.product-options-select', e.target).each( ( i, select ) => {
              $('option:first-of-type', select).prop("selected", true).trigger('change');
            })
          }
          closeDialog(e.target)
        }, 2000)
        return
      },
    });
  }
  
  $('.product-options-wrapper, .product-options-container-background').on('click', function (e) {
    if ( e.target !== this ) return
    closeDialog(this)
  })


function addVariableProductToCart (product, options) {
  checkCartForRedundanciesV2(product, options).then( variantId => {
    var postData = {
      quantity: 1,
      id: variantId,
      properties: {
        '_shopblind': 'true'
      }
    }
    addProduct( postData, product ).then( () => {
      return 'success'
    })
  })
}

function addProductToCart (product) {
  const applicableOptions = product.options.filter( option => {
    return option.toLowerCase() !== 'title' && option.toLowerCase() !== 'option'
  })
  
  checkCartForRedundanciesV2(product, applicableOptions).then( variantId => {
    var postData = {
      quantity: 1,
      id: variantId,
      properties: {
        '_shopblind': 'true'
      }
    }
    addProduct( postData, product ).then( () => {
      var podcastPixel = new Image();
      podcastPixel.src="https://data.adxcel-ec2.com/pixel/?ad_log=referer&action=content&pixid=e503aefe-73f2-46f2-8010-e12740208050";
      return 'success'
    })
  })
}

function stringToHtml (str) {
  var dom = document.createElement('div');
  dom.innerHTML = str;
  return dom.textContent || dom.innerText;
}

function addProduct( postData, product ) {
  return fetch('/cart/add.js', {
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
    triggerKlaviyoViewedProduct (product)
    $('.js-drawer-open-right').trigger('click')
    setTimeout( function () {
      $('[type="submit"]', e.target).removeClass('loading').val(buttonLabel)
      if ( !$(e.target).data('has-options') ) {
        $('.product-options-select', e.target).each( ( i, select ) => {
          $('option:first-of-type', select).prop("selected", true).trigger('change');
        })
      }
      closeDialog(e.target)
    }, 2000)
    return json
  })
  .catch(function(error) {
    console.log(error)
    // ShopifyAPI.onError(obj, status)
  })
}

function checkCartForRedundanciesV2 (product, options) {
  return new Promise((resolve, reject) => {
    const matchedVariants = options.length
      ? product.variants.filter(variant => {
          const matchedOptions = variant.options.filter( option => {
            return options.includes(option)
          })
          return matchedOptions.length === options.length
        })
      : product.variants
    if ( matchedVariants.length === 1 ) {
      resolve(matchedVariants[0].id)
    }
    var variantIds = []
    matchedVariants.forEach( variant => {
      if ( variant.available ) {
        variantIds.push(variant.id)
      }
    })
    var mutableVariantIds = variantIds.slice(0)

    fetch('/cart.js')
    .then(function(response) {
      return response.json();
    })
    .then(function(cart) {
      var variantId = variantIds[0]
      cart.items.forEach( item => {
        // item.properties && ... Switch to if product type == shopblind
        if ( item.product_id === product.id && mutableVariantIds.includes(item.id) ) {
          var index = mutableVariantIds.indexOf(item.id)
          mutableVariantIds.splice(index, 1)
        }
      })
      // If all of the options are already in the cart, choose another one at random.
      if ( mutableVariantIds.length ) {
        variantId = mutableVariantIds[0]
      } else {
        var randomVariant = Math.floor(Math.random() * variantIds.length)
        variantId = variantIds[randomVariant]
      }
      resolve(variantId)
    })
    .catch(function(error) {
      // eslint-disable-next-line no-console
      console.log(error);
    });
  })
  // const postData = {
  //   quantity: 1,
  //   id: productToAdd[0].id
  // }
}

function checkCartForRedundancies (product) {
  var variantIds = []
  product.variants.forEach( variant => {
    if ( variant.available ) {
      variantIds.push(variant.id)
    }
  })
  var mutableVariantIds = variantIds
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
      if ( item.product_id === product.id && mutableVariantIds.includes(item.id) ) {
        var index = mutableVariantIds.indexOf(item.id)
        mutableVariantIds.splice(index, 1)
      }
    })
    // If all of the options are already in the cart, choose another one at random.
    if ( mutableVariantIds.length === variantIds.length ) {
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

function triggerKlaviyoViewedProduct (product) {

  var item = {
    Name: product.title,
    ProductID: product.id,
    Categories: ['shop blind'],
    ImageURL: product.images[0],
    URL: "https://twoblindbrothers.com",
    Brand: product.vendor,
    Price: product.variants[0].price,
    CompareAtPrice: product.variants[0].compare_at_price
  };
  _learnq.push(['track', 'Added to Cart', item]);

  // If eligible for free product promo, show popup
  if ( $('.free-product-2bb').length ) {
    $.getJSON('/cart.js', function (cart, textStatus) {
      const hasPromo = cart.items.filter( item => {
        return item.product_type == 'Sock Promo'
      });
      let sockpromo = Cookies.get('sockpromo');
      if ( !$('#free-product-2bb-container').hasClass('active') && !hasPromo.length && sockpromo == 'true') {
        $('#free-product-2bb-container').addClass('active');
      }
    })
  }

}  
  
  // var _learnq = _learnq || [];
  // $('.shopblind_prod').each(function() {
  //   const $product = this
  //   const productHandle = $($product).data('handle')
  //     $.getJSON(`/products/${productHandle}.json`, function(product) {
  //       //const variants = []
  //       //_learnq.push(['track', 'Added to Cart', product]);
  //       // Check if there is inventory
  //       let isAvailable = false
  //       isAvailable = product.product.variants.filter( variant => {
  //         const available = variant.inventory_quantity || variant.inventory_policy === 'continue'
  //         return available
  //       })
  //       // If product is not available, abort
  //       if ( !isAvailable.length ) {
  //         return;
  //       }
  
  //       const productOptions = []
  //       let hasRandomizedOption = false
  //       product.product.options.map( option => {
  //         if ( option.name != 'Title' && option.name.toLowerCase() != 'option' ) {
  //           productOptions.push(option.name)
  //         }
  //         if ( option.name === 'Pick a Number.' || option.name === 'Color' ) {
  //           hasRandomizedOption = true
  //         }
  //         // if ( option.name.toLowerCase().indexOf("size") !== -1 ) {
  //         //   $('.default-one-size', $product).hide()
  //         // }
  //         if ( option.name.toLowerCase().indexOf("shopping for") !== -1 || option.name.toLowerCase().indexOf("color") !== -1 || option.name.toLowerCase().indexOf("option") !== -1 ) {
  //           $('.fake-select', $product).hide()
  //         }
  //       })
  
  //       let $buyButtonContainer = $('.sb-buy-button-container', $product)
  //       if ( productOptions.length ) {
  //         $($product).addClass('has-options')
  //         $('.toggle-sb-options', $product).attr('tabindex', '0')
  //         $('.toggle-sb-options', $product).on('click', function () {
  //           $('.toggle-sb-options', $product).attr('aria-pressed', true)
  //           $($product).addClass('show-options')
  //           $('.product-options', $product).attr('tabindex', '-1')
  //           $('.product-options', $product).focus()
  //           triggerKlaviyoViewedProduct(product)
  //         })
  //         $('.toggle-sb-options', $product).on('keydown', function () {
  //           if (event.key === " " || event.key === "Enter" || event.key === "Spacebar") {
  //             $('.toggle-sb-options', $product).attr('aria-pressed', true)
  //             $($product).addClass('show-options')
  //             $('.product-options', $product).attr('tabindex', '-1')
  //             $('.product-options', $product).focus()
  //             triggerKlaviyoViewedProduct(product)
  //           }
  //         })
  //         $('.close-product-options', $product).on('click', function () {
  //           $($product).removeClass('show-options')
  //           $('.toggle-sb-options', $product).attr('aria-pressed', false)
  //         })
  
  
  
  // //         $(document).keyup(function(e) {
  // //           if (e.key === "Escape") { // escape key maps to keycode `27`
  // //             if ( $('.sb-product-size-chart', $product).hasClass('active') ) {
  // //               $('.sb-product-size-chart', $product).removeClass('active')
  // //             } else if ( $($product).hasClass('show-options') ) {
  // //               $($product).removeClass('show-options')
  // //               $('.toggle-sb-options', $product).attr('aria-pressed', false)
  // //             }
  // //           }
  // //         });
  //         appendProductOptions(product, $product, hasRandomizedOption)
  //         $buyButtonContainer = $('.product-options', $product)
  //       }
  
  //       $($buyButtonContainer).append(`
  //         <a id="addToCart-${product.product.id}" tabindex="0" class="btn btn--xlarge add-to-cart" href="#">
  //           Add To Cart
  //         </a>
  //       `)
  
  //       handleAddToCart( product, $product, hasRandomizedOption )
  
  //       $('.product-options .add-to-cart', $product).on('keydown', function(e) {
  //         if ( e.keyCode === 9 && !e.shiftKey ) {
  //           e.preventDefault()
  //           $($product).find('select:visible:first').focus()
  //         }
  //       })
  //       $('select', $product).on('keydown', function(e) {
  //         const firstVisible = $('select:visible:first', $product).index()
  //         if ( e.keyCode === 9 && e.shiftKey && $(this).index() === firstVisible ) {
  //           e.preventDefault()
  //           $($product).find('.product-options .add-to-cart').focus()
  //         }
  //       })
  
  //     })
  // })
  
  
  // function appendProductOptions( product, $product, hasRandomizedOption ) {
  //   product.product.options.map( (option, index) => {
  //     var selectList = document.createElement("select")
  //     selectList.id = option.id
  //     selectList.className = option.name === 'Pick a Number.' || option.name === 'Color' || option.name.toLowerCase() === 'option' ? 'sb-option-select hidden' : 'sb-option-select visible'
  //     selectList.setAttribute('product-index', index)
  
  //     //Create default option
  //     const defaultOption = document.createElement("option");
  //     defaultOption.disabled = true
  //     defaultOption.selected = true
  //     defaultOption.text = option.name
  //     selectList.appendChild(defaultOption);
  
  //     //Create and append the options
  //     const optionsArray = option.values.filter( value => {
  //       return value === 'XS'
  //     })
  //     option.values.forEach( value => {
  //       if ( value !== 'XS' ) {
  //         optionsArray.push(value)
  //       }
  //     })
  //     optionsArray.map( value => {
  //       var choice = document.createElement("option");
  //       choice.value = value;
  //       choice.text = value;
  //       selectList.appendChild(choice);
  //     })
  //     $('.product-options', $product).append(selectList)
  //   })
  
  
  //   // Check for options that are sold out
  //   $('.sb-option-select', $product).each( function(index, select) {
  //     for (i = 0; i < select.options.length; i++) {
  //       if ( !select.options[i].disabled ) {
  //         select.options[i].hidden = true
  //       }
  //       // select.options[i].hidden = index > selectIndex ? true : false
  //       const selectVal = select.options[i].value
  //       product.product.variants.forEach( variant => {
  //         if ( variant[`option${index + 1}`] === selectVal && ( variant.inventory_quantity > 0 || variant.inventory_policy === 'continue' ) ) {
  //           select.options[i].hidden = false
  //         }
  //       })
  //     }
  //   })
  
  //   // Add size chart if there is body content
  //   if ( product.product.body_html !== '' ) {
  //     $('.product-options', $product).append(`
  //       <a class="sb-size-chart-popup-link" href="#size-chart">View Sizing Chart</a>
  //       <div class="sb-product-size-chart" aria-modal="true">
  //         <div class="table-container">
  //           <div class="close-size-chart"><span>Close</span></div>
  //           <div class="tables">
  //             ${product.product.body_html}
  //           </div>
  //         </div>
  //       </div>
  //     `)
  //     $('.sb-size-chart-popup-link', $product).on('click', function(e) {
  //       e.preventDefault()
  //       $('.sb-product-size-chart', $product).addClass('active').attr('tabindex', '-1')
  //       $('.sb-product-size-chart', $product).focus()
  //     })
  //     $('.sb-product-size-chart').on('click', function() {
  //       $('.sb-product-size-chart').removeClass('active').removeAttr('tabindex')
  //     })
  //     $('.product-options', $product).on('keydown', function (e) {
  //       if ( e.key === "Escape" ) {
  //         if ($('.sb-product-size-chart', $product).hasClass('active')) {
  //         	$('.sb-product-size-chart', $product).removeClass('active').removeAttr('tabindex')
  //             $('.product-options', $product).focus()
  //       	} else if ( $($product).hasClass('show-options') ) {
  //           $($product).removeClass('show-options')
  //           $('.toggle-sb-options', $product).attr('aria-pressed', false)
  //           $('.product-options', $product).removeAttr('tabindex')
  //         }
  //       }
  //     })
  //   }
  
  //   handleOptionSelect( product, $product )
  // }
  
  // function handleOptionSelect ( product, $product ) {
  //   $('.sb-option-select.visible', $product).on( 'change', function(currentSelect) {
  //     const selectIndex = $(currentSelect.target).attr('product-index')
  //     const selectedOptionVals = []
  //     $('.sb-option-select', $product).each( function(index, select) {
  //       if ( index > selectIndex ) {
  //         select.selectedIndex = 0
  //       }
  //       const selected = $(select).find(":selected")
  //       if ( !selected.prop('disabled') ) {
  //         selectedOptionVals[`option${index + 1}`] = selected.val()
  //       }
  //     })
  
  //     // If all options are selected, enable the buy button
  //     if ( Object.keys(selectedOptionVals).length === $('.sb-option-select.visible', $product).length ) {
  //       $($product).addClass('buy-active')
  //     } else {
  //       $($product).removeClass('buy-active')
  //     }
  
  //     $('.sb-option-select', $product).each( function(index, select) {
  //       for (i = 0; i < select.options.length; i++) {
  //         if ( index > selectIndex ) {
  //           select.options[i].hidden = true
  //         }
  //         // select.options[i].hidden = index > selectIndex ? true : false
  //         const selectVal = select.options[i].value
  //         product.product.variants.forEach( variant => {
  //           let matchedOptions = Object.keys(selectedOptionVals).filter( selectedOption => {
  //             return selectedOptionVals[selectedOption] === variant[selectedOption]
  //           })
  //           if ( matchedOptions.length === Object.keys(selectedOptionVals).length && ( variant.inventory_quantity > 0 || variant.inventory_policy === 'continue' ) && variant[`option${index + 1}`] === selectVal ) {
  //             select.options[i].hidden = false
  //           }
  //         })
  //       }
  //     })
  //   })
  // }
  
  // function handleAddToCart ( product, $product, hasRandomizedOption ) {
  //   $(`#addToCart-${product.product.id}`).on('click', function(e) {
  //     e.preventDefault()
  //     const selectedOptions = []
  //     // let hiddenSelectIndex = false
  //     $('.sb-option-select', $product).each( function(index, select) {
  //       const selectedOption = $(this).find(":selected").val()
  //       selectedOptions[`option${index + 1}`] = selectedOption
  //       // if ( $(select).hasClass('hidden') ) {
  //       //   hiddenSelectIndex = index
  //       // }
  //     })
  
  //     // Pick random item if there's a randomizer
  //     if ( hasRandomizedOption ) {
  //       const productOptions = $('.sb-option-select.hidden', $product)[0].options
  //       const hiddenSelectIndex = parseInt($('.sb-option-select.hidden', $product).attr('product-index'))
  //       const availableOptions = []
  //       for (i = 0; i < productOptions.length; i++) {
  //         if ( !$(productOptions[i]).prop('hidden') ) {
  //           availableOptions.push(productOptions[i])
  //         }
  //       }
  //       const randomVariant = Math.floor(Math.random() * availableOptions.length)
  //       selectedOptions[`option${hiddenSelectIndex + 1}`] = availableOptions[randomVariant].value
  //     }
  
  //     const chosenVariant = product.product.variants.filter( variant => {
  //       const selectedVariants = Object.keys(selectedOptions).filter( selectedOption => {
  //         return selectedOptions[selectedOption] === variant[selectedOption]
  //       })
  //       return selectedVariants.length === Object.keys(selectedOptions).length
  //     })
  
  //     _learnq.push(['track', 'Added to Cart', product]);
  
  //     var postData = {
  //       quantity: 1,
  //       id: chosenVariant[0].id
  //     }
  //     addItemToCart(postData, $product)
  //   })
  // }
  
  // function closeProductPopup() {
  //   $('#product-popup-content').html()
  //   $('#product-popup').removeClass('active')
  // }
  
  // function addItemToCart(product, $product) {
  //   if ( $('.loading', $product).length ) {
  //     $('.loading', $product).show()
  //   }
  //   $.ajax({
  //     type: 'POST',
  //     url: '/cart/add.js',
  //     dataType: 'json',
  //     data: product,
  //     success: function (response) {
  //       $('.js-drawer-open-right').click();
  //       $($product).removeClass('show-options')
  //       return
  //     },
  //     error: function (obj, status) {
  //       ShopifyAPI.onError(obj, status)
  //     },
  //     complete: function (result) {
  //       if ( $('.loading', $product).length ) {
  //         $('.loading', $product).hide()
  //       }
  //       // const newCartCount = parseInt($('.cart__item-count').html()) + 1
  //       // $('.cart__item-count').html(newCartCount);
  //       $('.sb-option-select', $product).each( function(index, select) {
  //         select.selectedIndex = 0
  //       })
  //     }
  //   });
  // }
  
  // function triggerKlaviyoViewedProduct (product) {
  //   var _learnq = _learnq || [];
  
  //   var item = {
  //     Name: product.product.title,
  //     ProductID: product.product.id,
  //     Categories: [product.product.product_type],
  //     ImageURL: product.product.images[0].src,
  //     URL: "https://twoblindbrothers.com",
  //     Brand: product.product.vendor,
  //     Price: product.product.variants[0].price,
  //     CompareAtPrice: product.product.variants[0].compare_at_price
  //   };
  
  //   _learnq.push(['track', 'Viewed Product', item]);
  //   _learnq.push(['trackViewedItem', {
  //     Title: item.Name,
  //     ItemId: item.ProductID,
  //     Categories: item.Categories,
  //     ImageUrl: item.ImageURL,
  //     Url: item.URL,
  //     Metadata: {
  //       Brand: item.Brand,
  //       Price: item.Price,
  //       CompareAtPrice: item.CompareAtPrice
  //     }
  //   }]);
  // }
  
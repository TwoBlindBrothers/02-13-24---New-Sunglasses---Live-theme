var _learnq = _learnq || [];
$('.shopblind_prod').each(function() {
  const $product = this
  const productHandle = $($product).data('handle')
  $('.btn', $product).on('click', function(e) {
    e.preventDefault()
    $.getJSON(`/products/${productHandle}.json`, function(product) {
      //const variants = []
      _learnq.push(['track', 'Added to Cart', product]);
      const productOptions = []
      product.product.options.map( option => {
        if ( option.name != 'Title' ) {
          productOptions.push(option.name)
        }
      })
      //replace options array with name only
      product.product.options = productOptions
      // No variants, add item to cart
      let postData
      // if ( options.length === 0 ) {
      //   postData = {
      //     quantity: 1,
      //     id: product.product.variants[0].id
      //   }
      //   addItemToCart(postData, options, $product)
      // }
      if ( productOptions.length < 2 ) {
        // One variant, choose a random product and add to cart
        const availableVariants = product.product.variants.filter( variant => {
          return variant.inventory_quantity > 0 || variant.inventory_policy === 'continue'
        })
        const variantCount = availableVariants.length
        const randomVariant = Math.floor(Math.random() * variantCount)

        postData = {
          quantity: 1,
          id: availableVariants[randomVariant].id
        }
        addItemToCart(postData, productOptions, $product)
      }
      if ( productOptions.length > 1 ) {
        let variantId
        let optionSelectors = `<select name="id" id="productSelector-${product.product.id}" class="product-single__variants">`
        product.product.variants.map( (variant, index) => {
          if ( variant.inventory_quantity > 0 || variant.inventory_policy === 'continue' ) {
            product.product.variants[index].available = true
            const variantOptions = []
            var i = 1
            while ( i < 4 ) {
              if ( variant[`option${i}`]) {
                variantOptions.push(variant[`option${i}`])
              }
              i++
            }
            product.product.variants[index].options = variantOptions
            product.product.variants[index].name = product.product.title + ' - ' + variant.title
            product.product.variants[index].public_title = variant.title
            product.product.variants[index].price = variant.price * 100
            optionSelectors += `<option value="${variant.id}" data-sku="${variant.sku}">${variant.title}</option>`
          } else {
            optionSelectors += `<option disabled>${variant.title} - SOLD OUT</option>`
          }
        })
        optionSelectors += '</select><span class="visually-hidden">Regular price</span>'
        $('#product-popup-content').html(`
          <div class="heatmap-close"><img src="{{ 'close-x-white.png' | asset_url }}"/></div>
          <span class="h1">$${product.product.variants[0].price / 100}</span>
          ${optionSelectors}
          <button class="btn btn--xlarge" id="addToCart-${product.product.id}">
            <span>Add To Cart</span>
          </button>
        `)
        $('#product-popup').addClass('active')
        var selectCallback = function(variant, selector) {
          variantId = variant.id
        };
        $(`#addToCart-${product.product.id}`).on('click', function() {
          postData = {
            quantity: 1,
            id: variantId
          }
          addItemToCart(postData, productOptions, $product)
        })
        $('.heatmap-close').on('click', function() {
          closeProductPopup()
        })

        new Shopify.OptionSelectors(`productSelector-${product.product.id}`, {
          product: product.product,
          onVariantSelected: selectCallback,
          enableHistoryState: false
        });
        Shopify.optionsMap = {};
        Shopify.updateOptionsInSelector = function(selectorIndex) {

          switch (selectorIndex) {
            case 0:
              var key = 'root';
              var selector = jQuery('.single-option-selector:eq(0)');
              break;
            case 1:
              var key = jQuery('.single-option-selector:eq(0)').val();
              var selector = jQuery('.single-option-selector:eq(1)');
              break;
            case 2:
              var key = jQuery('.single-option-selector:eq(0)').val();
              key += ' / ' + jQuery('.single-option-selector:eq(1)').val();
              var selector = jQuery('.single-option-selector:eq(2)');
              var colorName = selector.val();
          }

          var initialValue = selector.val();
          selector.empty();
          var availableOptions = Shopify.optionsMap[key];
          for (var i=0; i<availableOptions.length; i++) {
            var option = availableOptions[i];
            var newOption = jQuery('<option></option>').val(option).html(option);
            selector.append(newOption);
          }
          jQuery('.swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
            if (jQuery.inArray($(this).attr('data-value'), availableOptions) !== -1) {
              $(this).removeClass('soldout').show().find(':radio').removeAttr('disabled','disabled').removeAttr('checked');
            }
            else {
              $(this).addClass('soldout').find(':radio').removeAttr('checked').attr('disabled','disabled');
            }
          });

          if (jQuery.inArray(initialValue, availableOptions) !== -1) {
            selector.val(initialValue);
          }
          selector.trigger('change');

        };
        Shopify.linkOptionSelectors = function(product) {
          // Building our mapping object.
          for (var i=0; i<product.variants.length; i++) {
            var variant = product.variants[i];
            if (variant.available) {
              // Gathering values for the 1st drop-down.
              Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
              Shopify.optionsMap['root'].push(variant.option1);
              Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
              // Gathering values for the 2nd drop-down.
              if (product.options.length > 1) {
                var key = variant.option1;
                Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
                Shopify.optionsMap[key].push(variant.option2);
                Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
              }
              // Gathering values for the 3rd drop-down.
              if (product.options.length === 3) {
                var key = variant.option1 + ' / ' + variant.option2;
                Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
                Shopify.optionsMap[key].push(variant.option3);
                Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
              }
            }
          }
          // Update options right away.
          Shopify.updateOptionsInSelector(0);
          if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
          if (product.options.length === 3) Shopify.updateOptionsInSelector(2);

          // When there is an update in the first dropdown.
          jQuery(".single-option-selector:eq(0)").change(function() {
            Shopify.updateOptionsInSelector(1);
            if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
            return true;
          });
          // When there is an update in the second dropdown.
          jQuery(".single-option-selector:eq(1)").change(function() {
            if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
            return true;
          });

        }
        Shopify.linkOptionSelectors(product.product);
        // console.log(product.product.id)
        // new Shopify.OptionSelectors('productSelect-' + product.product.id, {
        //   product: product.product,
        //   onVariantSelected: function(variant, selector) {
        //     console.log(variant, selector)
        //   },
        //   enableHistoryState: false
        // });
        // Greater than 1, show popup with selector
        // let optionSelectors = ''
        // options.map( selector => {
        //   console.log(selector)
        //   optionSelectors += `<div class="sb-option-selector"><label>${selector.name}</label><select class="sb-selector">`
        //   selector.values.map( option => {
        //     optionSelectors += `<option value="${option}">${option}</option>`
        //   })
        //   optionSelectors += '</select></div>'
        // })
        // $($product).append(optionSelectors)
        // $('.sb-option-selector select', $product).on('change', function() {
        //   const selectVal = this.value
        //   // Find selected selectors
        //   const selectedOptions = []
        //   $('.sb-selector', $product).each( function(){
        //     console.log(this)
        //     if ( $('option:selected', this).length ) {
        //       selectedOptions.push($('option:selected', this).val())
        //     }
        //   })
        //   console.log(selectedOptions)
        //   // options.map( selector => {
        //   //
        //   // })
        // })
      }

    }) // End on click event
  })
  // $('.btn', $product).on('click', function(e){
  //   e.preventDefault();
  //   const productHandle = $($product).data('handle')
  // });
})

function closeProductPopup() {
  $('#product-popup-content').html()
  $('#product-popup').removeClass('active')
}
function addItemToCart(product, options, $product) {
  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    dataType: 'json',
    data: product,
    success: function (response) {
      $('.js-drawer-open-right').click();
      closeProductPopup()
      // ShopifyAPI.getCart(function(cart) {
      //   cart.items.map( item => {
      //     if ( options.length === 0 && item.id === response.id && item.variant_id === response.id && item.quantity === response.quantity ) {
      //       $('.btn span', $product).html('SOLD OUT')
      //       $('.btn', $product).addClass('disabled')
      //     }
      //   })
      // });
    },
    error: function (obj, status) {
      ShopifyAPI.onError(obj, status)
    }
  });
}

// $('.add-blind-item').on('submit', function(e) {
//   const $blindContainer = $(this).closest('.amb-product')
//   if ( !$("input.size-radio-button:checked", $blindContainer).length ) {
//     $('.select-size-error',  $blindContainer).show()
//     e.preventDefault()
//     return
//   }
//   if ( $('.js-drawer-open-right').length ) {
//     e.preventDefault()
//     const variableId = $("input.size-radio-button:checked", $blindContainer).data('variable')
//     console.log(variableId)
//     const postData = {
//       quantity: 1,
//       id: variableId
//     }
//     $.ajax({
//       type: 'POST',
//       url: '/cart/add.js',
//       dataType: 'json',
//       data: postData,
//       success: addToCartOk,
//       error: addToCartFail
//     });
//   }
// })

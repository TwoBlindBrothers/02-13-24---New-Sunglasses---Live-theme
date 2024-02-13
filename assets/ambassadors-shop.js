const storeUrl = window.location.href.split('guide-dog-shop/')
let storeID = storeUrl.length > 1 ? storeUrl.pop().split('?')[0].toUpperCase() : null
const apiURL = 'https://api.guidedogchallenge.com'
if ( storeID && storeID != null ) {
  queryStore(storeID)
  jQuery.post('/cart/update.js', {
    "attributes": {
      "ambassador_id": storeID
    }
  })
} else {
  guideDogFallBack()
}

function queryStore(storeID) {
  try {
    $.getJSON(`${apiURL}/amb-get-store`, { store: storeID }, function(ambassador) {
      if ( ambassador === 0 ) {
        $('#guide-dog-header-content').html(`
          <h2>
            We can't find this store.
            Please contact us at <a href="mailto:info@twoblindbrothers.com">info@twoblindbrothers.com</a> and include the store ID: ${storeID}
          </h2>
        `)
        guideDogFallBack();
        return
      }
      var email = ambassador.email
      var firstName = ambassador.firstName.substr(0,1).toUpperCase() + ambassador.firstName.substr(1)
      var lastName = ambassador.lastName.substr(0,1).toUpperCase() + ambassador.lastName.substr(1)
      var items = ambassador.items
      var message = ambassador.message
      $('.guide-dog-name').html(`${firstName} ${lastName}`)
      if ( message != null && message != '' ) {
        $('#guide-dog-header').append(`
          <p class="yellow bold guide-dog-message">"${message}"</p>
          <span class="quote-author">- ${firstName} ${lastName}</span>
        `)
      }
      getGuideDogProducts(items)
    })
    .fail(function() {
      guideDogFallBack();
    })
  }
  catch (error) {
    // show error ' could not find store'
    console.log(error);
  }
}

function getGuideDogProducts(items) {
  //var productPromises = []
  $.each(items, function(i, item) {

    $.getJSON(`/products/${item.handle}.json`, function(product) {
      let hideSelect = false
      const productOptions = []
      product.product.options.map( option => {
        productOptions.push(option.name)
        if ( option.name === 'Title' ) {
          hideSelect = true
        }
      })
      //replace options array with name only
      product.product.options = productOptions
      let productHTML = `
        <div id="gdc-product-${product.product.id}" class="guide-dog-product" data-variable="${product.product.variants[0].id}">
          <div class="product-price">
            $${Math.round(product.product.variants[0].price)}
          </div>`;
      //if ( product.product.variants.length > 1 ) {
        // add size selector
        productHTML += `
          <p class="select-size-error" style="display:none">Select a size</p>
          <div class="amb-size-options">`
        productHTML += `<select name="id" id="productSelector-${product.product.id}" class="product-single__variants">`
        const filteredVariantList = []
        product.product.variants.map( variant => {
          // Compare preselected options to options of variants
          let applicableVariation = false
          if ( item.options ) {
            let variationOptionsObj = {}
            Object.keys(item.options).map( (itemOption, index) => {
              variationOptionsObj[itemOption] = variant[`option${product.product.options.indexOf(itemOption) + 1}`]
              //applicableVariation = variant[`option${product.product.options.indexOf(itemOption) + 1}`] === item.options[itemOption] ? true : false
            })
            applicableVariation = isEquivalent( variationOptionsObj, item.options )
          } else {
            applicableVariation = true
          }
          if ( applicableVariation ) {
            if ( variant.inventory_quantity > 0 || variant.inventory_policy === 'continue' ) {
              variant.available = true
            }
            filteredVariantList.push(variant)
            // Switch option if product doesn't have color variations. This will allow sizes of socks etc.
            let activeOption = item.color ? variant.option2 : variant.option1
            let optionStatus = (variant.inventory_quantity > 0 || variant.inventory_policy === 'continue') ? 'available' : 'soldout'
            let optionEnabled = (variant.inventory_quantity > 0 || variant.inventory_policy === 'continue') ? 'enabled' : 'disabled'
            if ( variant.available ) {
              productHTML += `<option value="${variant.id}" data-sku="${variant.sku}">${variant.title}</option>`
            } else {
              productHTML += `<option disabled>${variant.title} - SOLD OUT</option>`
            }
            // productHTML += `
            //   <div data-value="${activeOption}" data-type="size" class="swatch-element ${optionStatus}">
            //     <input id="swatch-${product.id}-${p.position}" class="size-radio-button" data-sku="${p.sku}" data-variable="${p.id}" type="radio" name="option-${product.id}" value="${activeOption}" ${optionEnabled} />
            //     <label for="swatch-${product.id}-${p.position}">
            //       <span class="visually-hidden">${activeOption}</span>
            //       <span>${activeOption}</span>
            //     </label>
            //   </div>
            // `
          }
        })
        product.product.variants = filteredVariantList
        productHTML += '</select></div>'
      // }
      const productAvailable = product.product.variants[0].available ? 'Add To Cart' : 'Sold Out'
      productHTML += `
        <div class="add-blind-container">
          <form class="add-blind-item" method="post" action="/cart/add">
            <input class="variant-id" name="id" value="${product.product.variants[0].id}" type="hidden" />
            <input class="uppercase bold" name="add" value="${productAvailable}" type="submit" />
          </form>
        </div>
      </div>
      `
      $('#shop-guide-dog-products').append(productHTML)
      var selectCallback = function(variant, selector) {
        if (variant) {
          $(`#gdc-product-${product.product.id}`).data('variable', variant.id)
        }
      };
      new Shopify.OptionSelectors(`productSelector-${product.product.id}`, {
        product: product.product,
        onVariantSelected: selectCallback,
        enableHistoryState: false
      });

      // Iterate through each preselected option and hide that selector
      if ( item.options ) {
        Object.keys(item.options).map( itemOption => {
          $(`#gdc-product-${product.product.id} .selector-wrapper`).each(function () {
            if ( $('label', this).html() === itemOption || $('select option', this).length === 1) {
              $(this).hide()
            }
          })
        })
      }
      if ( hideSelect ) {
        $(`#gdc-product-${product.product.id} .selector-wrapper`).hide()
      }

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
        if (availableOptions) {
          for (var i=0; i<availableOptions.length; i++) {
            var option = availableOptions[i];
            var newOption = jQuery('<option></option>').val(option).html(option);
            selector.append(newOption);
          }
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
      addBlindItemsToCart(product.product.id)

    }).fail(function(event, jqxhr, exception) {
      if (jqxhr.status == 404) {
        console.log("error occurred ");
      }
    })
    //productPromises.push(getProduct)
  })
  // Promise.all(productPromises).then( result => {
  //   console.log(result)
  //   addBlindItemsToCart()
  // }).catch( error => {
  //   console.log(error)
  //   addBlindItemsToCart()
  // })
}

function guideDogFallBack() {
  $('#guide-dog-header-content').hide()
  $('#shop-guide-dog-products').html(`
    <div style="text-align: center;">
      <h1 style="text-align:center;">We can't find that store</h1>
      <h3 style="font-weight: 300;">Still want to shop blind?</h3>
      <a class="btn" href="https://twoblindbrothers.com">Click here</a>
    </div>
  `)
}

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

function addBlindItemsToCart(gdpId) {
  $(`#gdc-product-${gdpId} .size-radio-button`).on('change', function(e) {
    const $blindContainer = $(`#gdc-product-${gdpId}`)
    const variableId = $("input.size-radio-button:checked", $blindContainer).data('variable')
    $('.variant-id', $blindContainer).val(variableId)
    $('.select-size-error',  $blindContainer).hide()
  })
  $(`#gdc-product-${gdpId} .add-blind-item`).on('submit', function(e) {
    const $blindContainer = $(`#gdc-product-${gdpId}`)
    if ( $('input.size-radio-button', $blindContainer).length && !$("input.size-radio-button:checked", $blindContainer).length ) {
      $('.select-size-error',  $blindContainer).show()
      e.preventDefault()
      return
    }
    //if ( $('.js-drawer-open-right').length ) {
      e.preventDefault()
      const variableId = $('input.size-radio-button', $blindContainer).length
        ? $("input.size-radio-button:checked", $blindContainer).data('variable')
        : $($blindContainer).data('variable')
      const postData = {
        quantity: 1,
        id: variableId
      }
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        data: postData,
        success: addToCartOk,
        error: addToCartFail
      });
    //}
  })
}

function addToCartOk(product) {
//Want to open drawer here on success
  $('.js-drawer-open-right').click();
}

function addToCartFail(obj, status) {
  console.log(status)
}

$('input.size-radio-button').change(function() {
  var productColor = this.value;
  var $product = this.closest('.guide-dog-product')
  $('.mthumb', $product).removeClass('active');
  $($product).find('.mthumb.filter-' + productColor).addClass('active');
});

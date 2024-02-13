const apiURL = 'https://fullmetalworkshop.com/clients/2bb'
class Ambassador {
  constructor ( ambassador, init ) {
    this.products = [];
  }
  loginAmbassador ( ambassador ) {
    $('.amb-loader').show();
    const _this = this
    _this.firstName = ambassador[0].value
    _this.lastName = ambassador[1].value
    _this.email = ambassador[2].value
    $.post(`${apiURL}/amb-login-user`, ambassador, function( response ) {
      response = $.parseJSON(response)
      $('.amb-loader').hide();
      switch ( response.status ) {
        case 'has store':
        break;
        case 'logged in':
          _this.ambassador = response.id
          _this.getShareLink()
        break;
        case 'invalid email':
          const errors = { email: "Please use a valid email address" };
          $validateLogin.showErrors(errors);
        break;
        default:
          // error
        break;
      }
    })
  }
  // registerAmbassador ( ambassador ) {
  //   const _this = this
  //   $.post(`${apiURL}/amb-register-user`, ambassador, function( response ) {
  //     switch ( response.status ) {
  //       case 'has store':
  //       break;
  //       case 'logged in':
  //         _this.ambassador = response.id
  //       break;
  //       default:
  //         // error
  //       break;
  //     }
  //   })
  // }
  addProduct (product) {
    const productObj = {
      'id' : $(product).data('product-id'),
      'handle' : $(product).data('product-handle'),
      'color' : $(product).find('input.color-radio-button:checked').data('color')
    }
    this.products.push(productObj)
    this.showSelectedProducts()
  }
  removeProduct (product) {
    // enable share button
    const productId = $(product).data('product-id')
    this.products = $.grep(this.products, function(item){
      return item.id != productId;
    });
    this.showSelectedProducts()
  }
  showSelectedProducts () {
    // Toggle share link
    if ( this.products.length > 0 && !$('.share-ambassador').hasClass('active') ) {
      $('.share-ambassador').addClass('active')
    }
    if (this.products.length === 0 ) {
      $('.share-ambassador').removeClass('active')
    }
    $('.selected-image').empty();
    $.each( this.products, function(i, item) {
      var activeImage = $('#amb-product-' + item.id).find('.mthumb.active img');
      if ( activeImage.length === 0 ) {
        activeImage = $('#amb-product-' + item.id + ' .mthumb:first-of-type img');
      }
      $('.amb-selected').eq(i).find('.selected-image').html(activeImage.clone());
    })
  }
  getShareLink () {
    const _this = this
    const ambData = {
      id : _this.ambassador,
      items : _this.products,
      email : _this.email,
      firstName : _this.firstName,
      lastName : _this.lastName
    }
    $.post( `${apiURL}/amb-create-store`, { data: ambData }, function( ambassadorLink ) {
      if ( ambassadorLink === 'error') {
        $('.share-error').show()
        return
      }
      $('#congratulations-view-content').html(`
        <h2>Congratulations ${_this.firstName}, share your shop link:</h2>
        <h3>Share your link:</h3>
        <div class="amb-link">${ambassadorLink}</div>
        <a target=_blank href="https://twitter.com/share?text=Some+info+about+guide+dogs&url=${ambassadorLink}"  class="twitter"  onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;" >Share on twitter</a>
      `)
      $('#ambassador-info-form').hide()
      $('#congratulations-view').addClass('active');
    });
  }
}

var ambassador = new Ambassador()

// Validate login form
$('#ambassador-login').on('submit', function(e){
  e.preventDefault()
})

const $validateLogin = $('#ambassador-login').validate({
  rules: {
    firstName: "required",
    lastName: "required",
    email: {
      required: true,
      email: true
    }
  },
  // Specify validation error messages
  messages: {
    firstName: "Please enter your first name",
    lastName: "Please enter your last name",
    email: "Please enter a valid email address"
  },
  // Make sure the form is submitted to the destination defined
  // in the "action" attribute of the form when valid
  submitHandler: function(form) {
    ambassador.loginAmbassador($(form).serializeArray())
    return false
  }
});

$('input.color-radio-button').change(function() {
  var productColor = this.value;
  var $product = this.closest('.amb-product')
  $('.mthumb', $product).removeClass('active');
  $($product).find('.mthumb.filter-' + productColor).addClass('active');
  if ( $($product).find('.color-options-error').is(':visible') ) {
    $($product).find('.color-options-error').hide()
  }
});

$('.add-to-shop').on('click', function(e) {
  e.preventDefault()
  var $product = $(this).closest('.amb-product')
  if ( $('input.color-radio-button', $product).length && $('input.color-radio-button:checked', $product).length === 0 ) {
    $($product).find('.color-options-error').show()
    return
  }
  $($product).toggleClass('active')
  if ( $($product).hasClass('active') ) {
    ambassador.addProduct($product)
  } else {
    ambassador.removeProduct($product)
  }
})

$('.share-ambassador').on('click', function(e) {
  e.preventDefault()
  $('#ambassador-info-form').show()
})

// Validate register form
// $('#ambassador-register').on('submit', function(e){
//   e.preventDefault()
// }).validate({
//   rules: {
//     firstName: "required",
//     lastName: "required",
//     email: {
//       required: true,
//       email: true
//     },
//     password: {
//       required: true,
//       minlength: 5
//     },
//     confirm_password: {
//       equalTo: "#register-password"
//     }
//   },
//   // Specify validation error messages
//   messages: {
//     firstName: "Please enter your first name",
//     lastName: "Please enter your last name",
//     email: "Please enter a valid email address",
//     password: "Enter Password",
//     confirm_password: "Enter Confirm Password Same as Password"
//   },
//   // Make sure the form is submitted to the destination defined
//   // in the "action" attribute of the form when valid
//   submitHandler: function(form) {
//     ambassador.registerAmbassador($(form).serializeArray())
//     return false
//   }
// });

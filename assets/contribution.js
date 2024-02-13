$(function(){

  $('.contributions li button').on('click', (e) => {
    e.preventDefault()
    $('.contributions li button').removeClass('selected')
    $(e.target).addClass('selected')
    const variantId = $('.contributions li button.selected').data('variant-id')
    if ( variantId ) {
      $('.signup-fields').hide()
      $('.signup-fields').removeAttr('tabindex')
      $('.contribution-form input[type="submit"]').attr('formnovalidate', 'formnovalidate')
      $('.email-contributor').show()
      $('.contribution-form .btn').show()
    } else {
      $('.signup-fields').show()
      $('.signup-fields').remove('tabindex', '-1')
      $('.contribution-form input[type="submit"]').removeAttr('formnovalidate')
      $('.email-contributor').hide()
      $('.contribution-form .btn').hide();
    }
  })

  // $('.age-verified').on('change', (e) => {
  //   $('.age-error').hide()
  // })
  $('.contribution-form').on('submit', (e) => {
    e.preventDefault()
    // $('.age-error').hide()
    // if ( !$('.age-verified').is(':checked') ) {
    //   $('.age-error').show()
    //   return
    // }
    fbq('trackCustom', 'complete registration');
    if ( $('.contributions li button.selected').length ) {
      const variantId = $('.contributions li button.selected').data('variant-id')
      // If there's a variant id, add it to the cart, if not they are not contributing
      if ( variantId ) {
        $.ajax({
          url: '/cart/add.js',
          type: 'post',
          data: {
            id: variantId,
            quantity: 1
          },
          dataType: 'json',
        	success: data => {
            window.location = '/checkout'
          }
        })
      } else {
        signup_user()
      }
    }
  })

  function signup_user () {
    gtag('event', 'X Ambassadors Signup', {
      'event_category' : 'engagement',
      'event_label' : 'X Ambassadors Signup'
    });
    $('input[type="submit"]').val('Registering')
    $('.contribution-form errors').hide()
    var consentVersions = ['email']
    var signupData = {
      "g": "Ywy8AX",
      "$fields": "x-ambassadors,$source",
      "email": $('#email').val(),
      "$first_name": $('#first_name').val(),
      "$last_name": $('#last_name').val(),
      "$source": "X Ambassadors signup",
      "x-ambassadors": "true"
    }
    // $city
    // $region - state
    if ( $('#tel').val() ) {
      signupData['$phone_number'] = '+1' + $('#tel').val()
      signupData['sms_consent'] = true
      signupData['$consent'] = ['sms']
    }
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://manage.kmail-lists.com/ajax/subscriptions/subscribe",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
      },
      "data": signupData
    }
    $.ajax(settings).done(function (response) {
      $('.contribution-form input').val('')
      $('input[type="submit"]').val('You\'re Registered')
      $('.signup-fields').html('<p style="text-align: center; font-size: 14px;">Thanks for registering! You\'ll receive an email with event details shortly.</p>')
    }).error( err => {
      $('.contribution-form errors').show()
    });
  }

})

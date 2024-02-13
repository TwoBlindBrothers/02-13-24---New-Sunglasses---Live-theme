const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const order_id = urlParams.get('order_id')
if (order_id) {
    $('#order-id-input').val(order_id)
    searchOrder(order_id)
}

$('#order-search-form').on('submit', function (e) {
    e.preventDefault();
    const formData = $('#order-search-form').serializeArray()
    $('#order-id-input').removeClass('error');
    if (formData[0].value) {
        searchOrder(formData[0].value)
    } else {
        $('#order-id-input').addClass('error');
    }
})

$(document).ready(function () {
    $('#order-id-input').focus();
})

function searchOrder(id) {
    let hasOrders = false
    $('.order-search-error').removeClass('active');
    $('#order-search-form #twobbloader').show();
    id = id.replace('#', '');
    //const orderSearchURL = 'https://07c0-69-116-36-98.ngrok.io/api/v1/order'
    //   const orderSearchURL = 'https://app.guidedogchallenge.com/api/v1/order'
    const orderSearchURL = 'https://2bb-blind-bundles.fly.dev/api/order/search'
    $('#order-items').html('')
    $.get(orderSearchURL, { 'id': `${id}`, 'shop': 'two-blind-brothers.myshopify.com' }, function (orders, status) {
        console.log(orders)
        if ( Object.prototype.toString.call(orders) !== '[object Array]' || orders.length === 0 ) {
            $('#order-search-form #twobbloader').hide();
            $('.order-search-error').addClass('active');
            return
        }
        $('#order-search-form #twobbloader').hide();
        if (!$('#order-search-form-wrapper').hasClass('found-order')) {
            $('#order-search-form-wrapper').addClass('found-order')
        }
        orderItemsArr = ''
        orders.forEach((order, index) => {
            orderItemsArr += `<section class="sb-kit kit-${order.productId}">
                <div class="sb-kit-heading">
                    <h2 class="text-centered">${order.productName.split(' - ')[0]}</h2>
            `
                if ( order.productName.split(' - ').length > 1 ) {
                    orderItemsArr += `<h3 class="text-center" style="text-transform: uppercase;">${order.productName.split(' - ')[1]}</h3>`
                }

                if ( order.hasOwnProperty('trackingInfo') ) {
                    orderItemsArr += '<div class="order-shipment-header">'
                    order.trackingInfo.map(shipment => {
                        orderItemsArr += `<p style="margin-bottom: 0;">tracking #: <a style="display: inline-block" href="${shipment.url}" target="_blank">
                            ${shipment.number}
                        </a></p>`
                    })
                    orderItemsArr += '</div>'
                }
                orderItemsArr += '</div>'

                order.products.forEach( (product, index) => {
                    orderItemsArr += getProductContent(product, index)
                })

            orderItemsArr += '</section>'
        
        })

        $('#order-items').html(`
            <div id="order-items-list">
            <div style="border-bottom: 1px solid black; margin: 0 0 3rem;">
                <h3 class="h2 text-center" style="margin-bottom: 1rem;">Here are the Shop Blind items for your order #${id}</h3>
                <p style="text-align:center; margin: 0 0 1rem;"><span style="font-size: 1rem;">* This is for reference only and may not accurately represent the items received.</span></p>
            </div>
            ${orderItemsArr}
            </div>
            <h1 style="text-align: center">Thanks for shopping blind!</h1>
            <p>My brother and I are pleased to officially invite you to our Two Blind Brothers family. You took a leap and made a purchase with virtually no information. You trusted us. Now we’re honored to reveal the whole story.</p>
            <p>When someone shops blind, they prove something remarkable. They prove that genuine trust is real. They prove that they not only care about what a company sells but also what it stands for. They prove that when you face a challenge, you should embrace it. You are that person. In this way, the Shop Blind Challenge has helped us filter for the best people that any clothing brand or mission could ever hope to find. </p>
            <p>So, what comes in your order?</p>
            <p>The products you’re holding right now are quite special. The strength of this community has allowed Two Blind Brothers to work with the world’s best materials, fabrics, and production facilities. As soon as you touch the items, you’ll know it for yourself.</p>
            <p>We’re lucky to have a team and group of partners from former luxury brands who are willing to produce these items for the sake of our charitable mission. In addition, we’ve been able to work with visually-impaired production teams like Industries for the Blind. You’ll also notice a special detail--we try to incorporate a subtle braille word or message into all of our designs, as a way to honor our cause.</p>
            <p>Although some items and pricing are exclusive to the Shop Blind Challenge, you can also browse our fully revealed website for items with product details.</p>
            <p>Thank you for taking part in this special experience. It means more than you know!</p>
            <p style="margin-bottom: 0;">Regards,</p>
            <p><strong style="font-weight: 600; text-transform: none;">Bradford and Bryan Manning aka Two Blind Brothers</strong></p>
        `)

        console.log('ORDER', orders[0])

        const orderItems = []
        orders.forEach( order => {
            order.products.forEach( product => {
                if ( product.category !== 'Socks' ) {
                    orderItems.push(product)
                }
            })
        })

        orderItems.sort(function (a, b) {
            var diffA = parseInt(a.price);
            var diffB = parseInt(b.price);
        
            return diffB - diffA;
        });

        console.log(orderItems)

        
        const recommendationItem = orderItems.reduce( (recItem, orderItem) => {
            if ( orderItem.price > recItem.price ) {
                return orderItem
            } else {
                return recItem
            }
            
        }, {price: 0})

        console.log(recommendationItem)

        if ( recommendationItem ) {
            const recommendationId = recommendationItem.productId.split('/Product/')[1]
            $('#related-products-container').attr('data-product-id', recommendationId)
    
            loadProductRecommendationsIntoSection()
        }


        $('.reorder-button').on('click', function (e) {
            e.preventDefault()
            reorderProduct(this)
        })
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        $('#order-search-form #twobbloader').hide();
        $('.order-search-error').addClass('active');
        // if (!$('#order-search-form-wrapper').hasClass('found-order')) {
        //     $('#order-search-form-wrapper').addClass('found-order')
        // }
        console.error("Error:", textStatus, errorThrown);
    });
}

function reorderProduct(product) {
    const variantId = $(product).data('variant')
    const $button = $(product)
    $button.text('Adding To Cart')
    const postData = {
        quantity: 1,
        id: variantId
    }
    $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        data: postData,
        success: function () {
            $button.text('Added To Cart')
            $('.js-drawer-open-right').click();
        },
        error: function (e) {
            $button.text('Could not add product')
        }
    });
}

async function getIncludedVariants(includedVariants, item) {
    let sectionId = item.id.split('/')
    sectionId = sectionId[sectionId.length - 1]
    const variants = includedVariants.split('|')
    $.each(variants, function (i, variant) {
        const variantHandle = variant.split(':')[0]
        const variantId = variant.split(':')[1]
        setTimeout(function () {
            $.ajax({
                type: 'GET',
                url: `/products/${variantHandle}`,
                dataType: 'json',
                success: function (data) {
                    const selectedVariant = data.product.variants.filter(productVar => {
                        return String(productVar.id) === variantId
                    })
                    const productObj = {
                        id: data.product.id,
                        productUrl: `/products/${data.product.handle}?variant=${selectedVariant[0].id}`,
                        image: data.product.image 
                            ? data.product.image.src 
                            : data.product.productImages.length 
                                ? data.product.productImages[0].transformedSrc
                                : null,
                        available: item.available,
                        quantity: item.quantity,
                        product: data.product.title,
                        descriptionHtml: data.product.body_html,
                    }
                    if (selectedVariant[0].title !== 'Default Title') {
                        productObj.options = { 'options': selectedVariant[0].title }
                    }
                    if (data.product.images) {
                        const variantImage = data.product.images.filter(productImg => {
                            return productImg.variant_ids.includes(parseInt(variantId))
                        })
                        if (variantImage.length) {
                            productObj.image = variantImage[0].src
                        }
                    }
                    const itemContent = getProductContent(productObj, variantId, i)
                    $(`.kit-${sectionId}`).append(`${itemContent}`)
                    $(`#order-item-${variantId} .reorder-button`).on('click', function (e) {
                        e.preventDefault()
                        reorderProduct(this)
                    })
                    $(`#order-item-${variantId} .additional-details`).show()
                },
                error: function (e) {

                }
            })
        }, 200 * i);
    })
}

function getProductContent(item, index) {
    const numbering = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth', 'twenty-fifth']
    let orderItemsArr = ''
    let itemImage = item.image 
    ? item?.image.src 
        ? item.image.src
        : item.image 
    : item?.productImages?.length 
        ? item.productImages[0].transformedSrc
        : null
        
    const itemVariantTitle = item.variantTitle === 'Default Title' ? null : item.variantTitle
    orderItemsArr += `
        <h4 class="h3 uppercase bold underlined order-item-number">Your ${numbering[index]} item!</h4>
        <div class="order-item" id="order-item-${item.variantId}">
        <div class="order-item-left">
            <img src="${ itemImage }"/>`
        if ( item.available ) {
            orderItemsArr += `
        <button class="btn reorder-button" data-variant=${item.variantId}>Reorder this item</button>`
        }
        if ( item.hasVariants ) {
            orderItemsArr += `<a href="/products/${item.productHandle}?variant=${item.variantId}" target="_blank">More Color and Size Options</a>`
        }
        orderItemsArr += `</div>
        <div class="order-item-info">
            <h3 style="text-transform: uppercase; margin-bottom: 0; font-weight: 700;">${item.title}</h3>
            <div><p>${itemVariantTitle ? itemVariantTitle : ''}</p>${item.quantity > 1 ? '<p style="font-weight:900; font-size: .9rem;">QTY: ' + item.quantity + '</p>' : ''}</div>
            <div class="order-item-description">${item.descriptionHtml ? item.descriptionHtml : ''}</div>
            </div>
        </div>`
    return orderItemsArr
}

// $.getJSON( '/products/product-handle-here.json', function( product ) {
//   // Do stuff with your product object here
// })

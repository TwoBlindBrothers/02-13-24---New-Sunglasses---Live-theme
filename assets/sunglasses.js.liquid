document.addEventListener('DOMContentLoaded', function() {
    const triggers = document.querySelectorAll("[data-shine='trigger']")
    const destinationContainer = document.querySelector("[data-shine='destination']")
    const tempImages = document.querySelectorAll(".interactive-temp-image")
    tempImages.forEach((el) => {
      const tempImage = document.createElement('img')
      const tempImageId = el.getAttribute("data-id")
      const tempImageAlt = el.getAttribute("data-alt")
      const tempImageSrc = el.getAttribute("data-src")
      tempImage.setAttribute('data-id', tempImageId);
      tempImage.setAttribute('data-alt', tempImageAlt);
      tempImage.setAttribute('data-temp-src', tempImageSrc);
      tempImage.setAttribute('class', 'lazyload');
      destinationContainer.append(tempImage)
    })
    const images = destinationContainer.querySelectorAll("img")

    function showImage(evt) {
        // const targetImage = images[3]
        const selection = evt.target.getAttribute("data-id");
        triggers.forEach((el) => {
            el.classList.remove('is-active')
            evt.target.classList.add('is-active')
        })
        images.forEach((el) => {
            el.classList.remove('is-active')
            const imageSelect = el.getAttribute("data-id")
            if (imageSelect === selection) {
              if ( !el.getAttribute("src") ) {
                el.src = el.getAttribute("data-temp-src")
              }
              el.classList.add('is-active')
            }
        })
    }

    function runShine() {
        triggers.forEach(el => {
            el.addEventListener('mouseenter', showImage)
            el.addEventListener('focus', showImage)
        })
    }

    runShine()


    const stickyNav = document.querySelector(".sunglasses_stickynav nav")
    const stickyMenuLinks = document.querySelectorAll(".sunglasses_stickynav ul li a")
    const stickyNavMenuSelect = document.querySelector(".sunglasses_stickynav .menu_select")
    const stickyNavButton = document.querySelector(".sunglasses_stickynav .btn-mobile")

    function toggleStickMenu() {
        stickyNav.classList.toggle('open')
    }

    function mobileMenu() {
        stickyMenuLinks.forEach(el => {
            el.addEventListener('click', toggleStickMenu)
        })
        stickyNavMenuSelect.addEventListener('click', toggleStickMenu)
        stickyNavButton.addEventListener('click', function() {
            if (stickyNav.classList.toggle('open')) {
                stickyNav.classList.remove('open')
            }
        })
    }

    mobileMenu()

});

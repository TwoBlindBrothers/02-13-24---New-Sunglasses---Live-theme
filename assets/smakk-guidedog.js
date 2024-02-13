// add all the elements inside modal which you want to make focusable
const  focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const modal = document.querySelector('#rarity-popup'); // select the modal by it's id

const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
const focusableContent = modal.querySelectorAll(focusableElements);
const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal
let lastFocusedElement = document.activeElement

$('.rarity-popup-trigger').on('click keydown', function (e) {
  if ( e.type === 'keydown' && e.keyCode !== 13) {
    return
  }
  if ( $('.rarity-popup').is(':visible') ) {
    return
  }
  lastFocusedElement = document.activeElement
  $('.rarity-popup').show();
  firstFocusableElement.focus();
  document.addEventListener('keydown', popupClickFunctions);
})

$('.rarity-popup a').on('click', function (e) {
  e.preventDefault()
  closeRarityPopup()
  this.click()
})
$('.rarity-close').on('click', function () {
  closeRarityPopup()
})

$(document).mouseup(function(e) {
  var container = $('.rarity-blocks');
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    closeRarityPopup()
  }
});

function closeRarityPopup () {
  $('.rarity-popup').hide();
  // lastFocusedElement.focus()
  document.removeEventListener('keydown', popupClickFunctions)
}

const popupClickFunctions = (e) => {
  let isTabPressed = e.key === 'Tab' || e.keyCode === 9 || e.key == 'Escape';
  if (!isTabPressed) {
    return;
  }

  if (e.shiftKey) { // if shift key pressed for shift + tab combination
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus(); // add focus for the last focusable element
      e.preventDefault();
    }
  }
  if ( e.keyCode == 9 ) {
    if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
      firstFocusableElement.focus(); // add focus for the first focusable element
      e.preventDefault();
    }
  }
  if ( e.key == 'Escape' ) {
    closeRarityPopup()
  }
}

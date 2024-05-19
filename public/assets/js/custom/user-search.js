'use strict';

// Class definition
var KTModalUserSearch = (function() {
  // Private variables
  var element;
  var resultsElement;
  var wrapperElement;
  var emptyElement;
  var searchObject;

  // Private functions
  var processs = function(search) {
    var timeout = setTimeout(function() {
      var number = KTUtil.getRandomInt(1, 3);

      // Hide recently viewed

      if (number === 3) {
        // Hide results
        resultsElement.classList.add('d-none');
        // Show empty message
        emptyElement.classList.remove('d-none');
      } else {
        // Show results
        resultsElement.classList.remove('d-none');
        // Hide empty message
        emptyElement.classList.add('d-none');
      }

      // Complete search
      search.complete();
    }, 1500);
  };

  var clear = function(search) {
    // Hide results
    resultsElement.classList.add('d-none');
    // Hide empty message
    emptyElement.classList.add('d-none');
  };

  // Public methods
  return {
    init: function() {
      // Elements
      element = document.querySelector('#kt_modal_users_search_handler');

      if (!element) {
        return;
      }

      wrapperElement = element.querySelector(
        '[data-kt-search-element="wrapper"]'
      );
      resultsElement = element.querySelector(
        '[data-kt-search-element="results"]'
      );
      console.log(element);
      inputElement = element.querySelector('[data-kt-search-element="input"]');
      emptyElement = element.querySelector('[data-kt-search-element="empty"]');

      // Initialize search handler
      searchObject = new KTSearch(element);

      // Search handler
      searchObject.on('kt.search.process', processs);

      // Clear handler
      searchObject.on('kt.search.clear', clear);
    }
  };
})();

// On document ready
KTUtil.onDOMContentLoaded(function() {
  KTModalUserSearch.init();
});

/* eslint-disable */

// Class definition
var AddProjectMember = (function () {
  let submitButton;
  let cancelButton;
  let searchButton;
  let userSearchInput;
  let form;
  let modal;

  const searchUsers = function () {
    searchButton.addEventListener('click', function (e) {
      e.preventDefault();
      fetch(`api/v1/users?search=${userSearchInput.value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          const user = data.data.data[0];
          const userEl = document.getElementById('search_output');
          console.log(user);
          userEl.innerHTML = `<div class="d-flex align-items-center p-3 rounded bg-state-light bg-state-opacity-50 mb-1">
          <div class="symbol symbol-35px symbol-circle me-5">
            <img alt="Pic" src="assets/media/avatars/${user.photo}" /></div>
          <div class="fw-bold">
            <span class="fs-6 text-gray-800 me-2">${user.name}</span>
            <span class="badge badge-light">${user.role}</span></div>
            <div class="fw-semibold">
            <select class="form-select form-select-solid" placeholder="Select a role">
              <option></option>
              <option value="Administrator">Administrator</option>
              <option value="Member">Member</option>
              <option value="Viewer">Viewer</option></select></div>
            `;
        });
    });
  };

  // Handle form validation and submittion
  const handleForm = function () {
    // Action buttons
    submitButton.addEventListener('click', function (e) {
      e.preventDefault();

      submitButton.setAttribute('data-kt-indicator', 'on');

      // Disable button to avoid multiple click
      submitButton.disabled = true;

      const formData = new FormData(form);
      const formDataObject = {};

      fetch(`/api/v1/tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify(formDataObject), // Convert form data object to JSON string
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(function (response) {
          // Handle response from server
          if (response.ok) {
            Swal.fire({
              text: 'Ticket has been successfully updated!',
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            }).then(function (result) {
              if (result.isConfirmed) {
                modal.hide();
              }
            });

            submitButton.removeAttribute('data-kt-indicator');

            // Enable button
            submitButton.disabled = false;

            location.reload(true);
          } else {
            Swal.fire({
              text: 'Sorry, looks like there are some errors detected, please try again.',
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            });
          }
        })
        .catch(function (error) {
          // Handle network or other errors
          console.error('Error:', error);
        });
    });

    cancelButton.addEventListener('click', function (e) {
      e.preventDefault();

      Swal.fire({
        text: 'Are you sure you would like to cancel?',
        icon: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'Yes, cancel it!',
        cancelButtonText: 'No, return',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-active-light',
        },
      }).then(function (result) {
        if (result.value) {
          form.reset(); // Reset form
          modal.hide(); // Hide modal
        } else if (result.dismiss === 'cancel') {
          Swal.fire({
            text: 'Your form has not been cancelled!.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Ok, got it!',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
        }
      });
    });
  };

  return {
    // Public functions
    init: function () {
      // Elements
      modalEl = document.querySelector('#modal_add_member');

      if (!modalEl) {
        return;
      }

      modal = new bootstrap.Modal(modalEl);

      form = document.querySelector('#modal_add_project_members_form');
      submitButton = document.getElementById('kt_modal_users_search_submit');
      cancelButton = document.getElementById('kt_modal_users_search_reset');
      searchButton = document.getElementById(
        'modal_add_project_members_search',
      );
      userSearchInput = document.getElementById(
        'modal_add_project_members_search_input',
      );

      searchUsers();
      handleForm();
    },
  };
})();

// // On document ready
// KTUtil.onDOMContentLoaded(function () {
//   AddProjectMember.init();
// });

/* eslint-disable */

('use strict');

// Class definition
var KTModalUserSearch = (function () {
  // Private variables
  var element;
  var suggestionsElement;
  var resultsElement;
  var wrapperElement;
  var emptyElement;
  var searchObject;
  var searchListElement;
  var selectedListElement;
  var usersToAdd = [];

  // Private functions
  var processs = function (search) {
    var timeout = setTimeout(function () {
      fetch(`api/v1/users?search=${search.inputElement.value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          searchResult = data.data.data;
          if (searchResult.length === 0) {
            // Hide results
            resultsElement.classList.add('d-none');
            // Show empty message
            emptyElement.classList.remove('d-none');
          } else {
            // Show results
            resultsElement.classList.remove('d-none');
            usersToAdd.append(searchResult);
            toAdd = '';
            for (let i = 0; i < searchResult.length; i++) {
              toAdd += `<div class="rounded d-flex flex-stack bg-active-lighten p-4" data-user-id="1">
              <!--begin::Details-->
              <div class="d-flex align-items-center">
                <!--begin::Checkbox-->
                <label class="form-check form-check-custom form-check-solid me-5">
                  <input class="form-check-input" type="checkbox" name="users" data-kt-check="true" data-kt-check-target="[data-user-id='1']" value="1" />
                </label>
                <div class="symbol symbol-35px symbol-circle">
                  <img alt="Pic" src="assets/media/avatars/${searchResult[i].photo}" />
                </div>
                <div class="ms-5">
                  <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">${searchResult[i].name}</a>
                  <div class="fw-semibold text-muted">${searchResult[i].email}</div>
                </div>
              </div>
              <div class="ms-2 w-100px">
                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true">
                  <option value="1" selected="selected">Guest</option>
                  <option value="2">Owner</option>
                  <option value="3">Can Edit</option>
                </select>
              </div>
            </div>
            <div class="border-bottom border-gray-300 border-bottom-dashed"></div>`;
            }
            searchListElement.innerHTML = toAdd + searchListElement.innerHTML;
            for (let i = 0; i < usersToAdd.length; i++) {
              selectedListElement += `<div class="rounded d-flex flex-stack bg-active-lighten p-4" data-user-id="1">
              <!--begin::Details-->
              <div class="d-flex align-items-center">
                <!--begin::Checkbox-->
                <label class="form-check form-check-custom form-check-solid me-5">
                  <input class="form-check-input" type="checkbox" name="users" data-kt-check="true" data-kt-check-target="[data-user-id='1']" value="1" />
                </label>
                <div class="symbol symbol-35px symbol-circle">
                  <img alt="Pic" src="assets/media/avatars/${usersToAdd[i].photo}" />
                </div>
                <div class="ms-5">
                  <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">${usersToAdd[i].name}</a>
                  <div class="fw-semibold text-muted">${usersToAdd[i].email}</div>
                </div>
              </div>
              <div class="ms-2 w-100px">
                <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true">
                  <option value="1" selected="selected">Guest</option>
                  <option value="2">Owner</option>
                  <option value="3">Can Edit</option>
                </select>
              </div>
            </div>
            <div class="border-bottom border-gray-300 border-bottom-dashed"></div>`;
            }
            // Hide empty message
            emptyElement.classList.add('d-none');
          }
        })
        .catch((error) => console.error('Error:', error));
      // Hide recently viewed
      suggestionsElement.classList.add('d-none');

      // if (number === 3) {
      //   // Hide results
      //   resultsElement.classList.add('d-none');
      //   // Show empty message
      //   emptyElement.classList.remove('d-none');
      // } else {
      //   // Show results
      //   resultsElement.classList.remove('d-none');
      //   // Hide empty message
      //   emptyElement.classList.add('d-none');
      // }

      // Complete search
      console.log(search.inputElement.value);
      search.complete();
    }, 1500);
  };

  var clear = function (search) {
    // Show recently viewed
    suggestionsElement.classList.remove('d-none');
    // Hide results
    resultsElement.classList.add('d-none');
    // Hide empty message
    emptyElement.classList.add('d-none');
  };

  // Public methods
  return {
    init: function () {
      // Elements
      element = document.querySelector('#kt_modal_users_search_handler');

      if (!element) {
        return;
      }

      wrapperElement = element.querySelector(
        '[data-kt-search-element="wrapper"]',
      );
      suggestionsElement = element.querySelector(
        '[data-kt-search-element="suggestions"]',
      );
      resultsElement = element.querySelector(
        '[data-kt-search-element="results"]',
      );
      searchListElement = element.querySelector('#search_results');
      selectedListElement = element.querySelector('#selected_users');
      emptyElement = element.querySelector('[data-kt-search-element="empty"]');

      // Initialize search handler
      searchObject = new KTSearch(element);

      // Search handler
      searchObject.on('kt.search.process', processs);

      // Clear handler
      searchObject.on('kt.search.clear', clear);
    },
  };
})();

// On document ready
KTUtil.onDOMContentLoaded(function () {
  KTModalUserSearch.init();
});

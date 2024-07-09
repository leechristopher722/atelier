/* eslint-disable */

// Class definition
export const ModalUserSearch = (function () {
  // Private variables
  var element;
  var searchElement;
  var resultsElement;
  var searchObject;
  var resultsListElement;
  var submitButton;
  var modal;

  function addUserToList(user) {
    // Check if the user is already in the project
    const existingMemberUser = resultsElement.querySelector(
      `[current-user-id='${user._id}']`,
    );
    if (existingMemberUser) {
      Swal.fire({
        text: `${user.name} is already a Project Member.`,
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }

    // Check if the user is already in the list
    const existingListUser = resultsElement.querySelector(
      `[data-user-id='${user._id}']`,
    );
    if (existingListUser) {
      Swal.fire({
        text: `${user.name} is already on the list.`,
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }

    // Create the user element
    const userElement = document.createElement('div');
    userElement.className = 'rounded d-flex flex-stack bg-active-lighten p-4';
    userElement.setAttribute('data-user-id', user._id);

    userElement.innerHTML = `
      <div class="d-flex align-items-center">
        <label class="form-check form-check-custom form-check-solid me-5">
          <input class="form-check-input" checked="true" type="checkbox" name="users" data-kt-check="true" data-kt-check-target="[data-user-id='${user._id}']" value="1" />
        </label>
        <div class="symbol symbol-35px symbol-circle">
          <img alt="Pic" src="assets/media/avatars/${user.photo}" />
        </div>
        <div class="ms-5">
          <a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">${user.name}</a>
          <div class="fw-semibold text-muted">${user.email}</div>
        </div>
      </div>
      <div class="ms-2 w-100px">
        <select class="form-select form-select-solid form-select-sm" data-control="select2" data-hide-search="true">
          <option value="Viewer" selected="selected">Viewer</option>
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
    `;

    if (resultsListElement.innerHTML !== '') {
      const separator = document.createElement('div');
      separator.className =
        'border-bottom border-gray-300 border-bottom-dashed';
      resultsListElement.appendChild(separator);
    }

    // Append the user element to the list
    resultsListElement.appendChild(userElement);
  }
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

          // Clear the previous search results
          searchElement.innerHTML = '';
          resultsElement.classList.remove('d-none');

          if (searchResult.length === 0) {
            searchElement.innerHTML = `<div class="text-muted fw-semibold fs-5 mb-2">Search Results</div>
              <div class="d-flex align-items-center text-muted">No users found with such name or email</div>`;
          } else {
            let dropdownContent =
              '<div class="text-muted fw-semibold fs-5 mb-2">Search Results</div>';

            // Create dropdown items for each search result
            for (let i = 0; i < searchResult.length; i++) {
              dropdownContent += `<div class="dropdown-item p-3" data-user-id="${searchResult[i]._id}">
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-35px symbol-circle">
                      <img alt="Pic" src="assets/media/avatars/${searchResult[i].photo}" />
                    </div>
                    <div class="ms-5">
                      <a class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">${searchResult[i].name}</a>
                      <div class="fw-semibold text-muted">${searchResult[i].email}</div>
                    </div>
                  </div>
                </div>`;

              if (i < searchResult.length - 1) {
                dropdownContent +=
                  '<div class="border-bottom border-gray-300 border-bottom-dashed"></div>';
              }
            }

            searchElement.innerHTML += dropdownContent;

            // Add click event listeners to dropdown items
            const dropdownItems =
              searchElement.querySelectorAll('.dropdown-item');
            dropdownItems.forEach((item) => {
              item.addEventListener('click', function () {
                const userId = item.getAttribute('data-user-id');
                const user = searchResult.find((user) => user._id === userId);
                addUserToList(user);
              });
            });

            // Show the dropdown suggestions
            searchElement.classList.remove('d-none');
          }
        })
        .catch((error) => console.error('Error:', error));

      // Complete search
      search.complete();
    }, 1500);
  };

  var clear = function (search) {
    searchElement.classList.add('d-none');
  };

  function collectSelectedUsers() {
    const selectedUsers = [];
    const userElements = resultsListElement.querySelectorAll('[data-user-id]');

    userElements.forEach((userElement) => {
      const checkbox = userElement.querySelector('input[type="checkbox"]');
      if (checkbox.checked) {
        const userId = userElement.getAttribute('data-user-id');
        const userRole = userElement.querySelector('select').value;
        selectedUsers.push({ account: userId, access: userRole });
      }
    });

    return selectedUsers;
  }

  var addMember = function () {
    const selectedUsers = collectSelectedUsers();
    const projectId = resultsElement.querySelector('#project-id').value;
    submitButton.disabled = true;

    if (selectedUsers.length > 0) {
      fetch(`api/v1/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addMembers: selectedUsers }),
      })
        .then((response) => {
          if (!response.ok) {
            Swal.fire({
              text: 'Sorry, looks like there are some errors detected, please try again.',
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            }).then(function (result) {
              if (result.isConfirmed) {
                submitButton.disabled = false;
              }
            });
          } else {
            Swal.fire({
              text: 'Selected users have been successfully added!',
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            }).then(function (result) {
              console.log(result.isConfirmed);
              if (result.isConfirmed) {
                modal.hide();

                location.reload(true);
              }
            });
          }
        })
        .catch((error) => console.error('Error:', error));
    } else {
      Swal.fire({
        text: 'Please select at least one user.',
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      }).then(function (result) {
        if (result.isConfirmed) {
          submitButton.disabled = false;
        }
      });
    }
  };

  // Public methods
  return {
    init: function () {
      // Elements
      element = document.querySelector('#kt_modal_users_search_handler');

      if (!element) {
        return;
      }

      modal = new bootstrap.Modal(
        document.querySelector('#kt_modal_users_search'),
      );

      searchElement = element.querySelector(
        '[data-kt-search-element="search"]',
      );
      resultsElement = element.querySelector(
        '[data-kt-search-element="results"]',
      );
      resultsListElement = element.querySelector('#users_add');
      submitButton = element.querySelector('#kt_modal_users_search_submit');

      // Initialize search handler
      searchObject = new KTSearch(element);

      // Search handler
      searchObject.on('kt.search.process', processs);

      // Clear handler
      searchObject.on('kt.search.clear', clear);

      // Submit handler
      submitButton.addEventListener('click', addMember);
    },
  };
})();

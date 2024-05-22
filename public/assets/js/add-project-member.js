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
      fetch(`api/v1/users?email=${userSearchInput.value}`, {
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
          userEl.innerHTML = `<div>${user.name}</div>`;
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
      submitButton = document.getElementById(
        'modal_add_project_members_submit',
      );
      cancelButton = document.getElementById(
        'modal_add_project_members_cancel',
      );
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

// On document ready
KTUtil.onDOMContentLoaded(function () {
  AddProjectMember.init();
});

'use strict';

// Class definition
function KTModalUpdateTicket(modalEl, ticketId) {
  var submitButton;
  var cancelButton;
  var validator;
  var form;
  var modal;

  // Init form inputs
  var initForm = function() {
    // Tags. For more info, please visit the official plugin site: https://yaireo.github.io/tagify/
    var tags = new Tagify(form.querySelector('[name="tags"]'), {
      whitelist: ['Development', 'Bug', 'High', 'Medium', 'Low'],
      maxTags: 5,
      dropdown: {
        maxItems: 10, // <- mixumum allowed rendered suggestions
        enabled: 0, // <- show suggestions on focus
        closeOnSelect: false // <- do not hide the suggestions dropdown once an item has been selected
      }
    });
    tags.on('change', function() {
      // Revalidate the field when an option is chosen
      validator.revalidateField('tags');
    });

    // Due date. For more info, please visit the official plugin site: https://flatpickr.js.org/
    var dueDate = $(form.querySelector('[name="due_date"]'));
    dueDate.flatpickr({
      enableTime: true,
      dateFormat: 'd, M Y, H:i'
    });

    // Team assign. For more info, plase visit the official plugin site: https://select2.org/
    $(form.querySelector('[name="team_assign"]')).on('change', function() {
      // Revalidate the field when an option is chosen
      validator.revalidateField('team_assign');
    });
  };

  // Handle form validation and submittion
  var handleForm = function() {
    // Stepper custom navigation

    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    validator = FormValidation.formValidation(form, {
      fields: {
        target_title: {
          validators: {
            notEmpty: {
              message: 'Target title is required'
            }
          }
        },
        target_assign: {
          validators: {
            notEmpty: {
              message: 'Target assign is required'
            }
          }
        },
        due_date: {
          validators: {
            notEmpty: {
              message: 'Target due date is required'
            }
          }
        },
        tags: {
          validators: {
            notEmpty: {
              message: 'Target tags are required'
            }
          }
        }
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap: new FormValidation.plugins.Bootstrap5({
          rowSelector: '.fv-row',
          eleInvalidClass: '',
          eleValidClass: ''
        })
      }
    });

    // Action buttons
    submitButton.addEventListener('click', function(e) {
      e.preventDefault();

      // Validate form before submit
      if (validator) {
        validator.validate().then(function(status) {
          console.log('validated!');

          if (status == 'Valid') {
            submitButton.setAttribute('data-kt-indicator', 'on');

            // Disable button to avoid multiple click
            submitButton.disabled = true;

            setTimeout(function() {
              //form.submit(); // Submit form
              var formData = new FormData(form); // Create FormData object from form
              var formDataObject = {}; // Create an empty object to store form data as key-value pairs

              // Loop through FormData entries and populate formDataObject
              formData.forEach(function(value, key) {
                if (key === 'target_title') {
                  formDataObject['name'] = value;
                } else if (key === 'target_details') {
                  formDataObject['description'] = value;
                } else if (key === 'due_date') {
                  formDataObject['dueDate'] = new Date(value);
                } else if (key === 'tags') {
                  var tagsArray = [];
                  const tagsInput = JSON.parse(value);
                  for (var i = 0; i < tagsInput.length; i++) {
                    tagsArray.push(tagsInput[i].value);
                  }
                  formDataObject['tags'] = tagsArray;
                }
              });

              // TODO: Implement assignedTo after implementing Project Memebers & Provide options on the ticket modal

              // Now you can send the form data to your server using an HTTP request (e.g., AJAX)
              fetch('http://127.0.0.1:8000/api/v1/tickets/' + ticketId, {
                method: 'PATCH',
                body: JSON.stringify(formDataObject), // Convert form data object to JSON string
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(function(response) {
                  // Handle response from server
                  if (response.ok) {
                    // Show success message. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    Swal.fire({
                      text: 'Ticket has been successfully updated!',
                      icon: 'success',
                      buttonsStyling: false,
                      confirmButtonText: 'Ok, got it!',
                      customClass: {
                        confirmButton: 'btn btn-primary'
                      }
                    }).then(function(result) {
                      if (result.isConfirmed) {
                        modal.hide();
                      }
                    });

                    submitButton.removeAttribute('data-kt-indicator');

                    // Enable button
                    submitButton.disabled = false;

                    location.reload(true);
                  } else {
                    // TODO: Handle error on the server side response here
                    // Error occurred during form submission
                    // Optionally, you can handle error response here
                  }
                })
                .catch(function(error) {
                  // Handle network or other errors
                  console.error('Error:', error);
                });
            }, 2000);
          } else {
            // Show error message.
            Swal.fire({
              text:
                'Sorry, looks like there are some errors detected, please try again.',
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            });
          }
        });
      }
    });

    cancelButton.addEventListener('click', function(e) {
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
          cancelButton: 'btn btn-active-light'
        }
      }).then(function(result) {
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
              confirmButton: 'btn btn-primary'
            }
          });
        }
      });
    });
  };

  return {
    // Public functions
    init: function(modalEl, ticketId) {
      // Elements
      // modalEl = document.querySelector('#kt_modal_update_ticket');

      if (!modalEl) {
        return;
      }

      modal = new bootstrap.Modal(modalEl);

      form = document.querySelector('#kt_modal_update_ticket_form_' + ticketId);
      submitButton = document.getElementById(
        'kt_modal_update_ticket_submit_' + ticketId
      );
      cancelButton = document.getElementById(
        'kt_modal_update_ticket_cancel_' + ticketId
      );

      initForm();
      handleForm();
    }
  };
}

// On document ready
KTUtil.onDOMContentLoaded(function() {
  var modalEls = document.querySelectorAll(
    '[id^="kt_modal_update_ticket_modal_"]'
  );

  modalEls.forEach(function(el) {
    var id = el.id;
    var ticketId = id.replace('kt_modal_update_ticket_modal_', '');
    var modalInstance = new KTModalUpdateTicket(el, ticketId);
    modalInstance.init(el, ticketId);
  });
});

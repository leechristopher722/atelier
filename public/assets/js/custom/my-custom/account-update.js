'use strict';

// Class definition
var KTAccountSettingsProfileDetails = (function() {
  // Private variables
  var form;
  var submitButton;
  var validation;

  // Private functions
  var initValidation = function() {
    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    validation = FormValidation.formValidation(form, {
      fields: {
        name: {
          validators: {
            notEmpty: {
              message: 'Name is required'
            }
          }
        },
        email: {
          validators: {
            notEmpty: {
              message: 'Email is required'
            },
            emailAddress: {
              message: 'The value is not a valid email address'
            }
          }
        }
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        submitButton: new FormValidation.plugins.SubmitButton(),
        //defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
        bootstrap: new FormValidation.plugins.Bootstrap5({
          rowSelector: '.fv-row',
          eleInvalidClass: '',
          eleValidClass: ''
        })
      }
    });

    // // Select2 validation integration
    // $(form.querySelector('[name="country"]')).on('change', function() {
    //   // Revalidate the color field when an option is chosen
    //   validation.revalidateField('country');
    // });

    // $(form.querySelector('[name="language"]')).on('change', function() {
    //   // Revalidate the color field when an option is chosen
    //   validation.revalidateField('language');
    // });

    // $(form.querySelector('[name="timezone"]')).on('change', function() {
    //   // Revalidate the color field when an option is chosen
    //   validation.revalidateField('timezone');
    // });
  };

  var handleForm = function() {
    submitButton.addEventListener('click', function(e) {
      e.preventDefault();

      validation.validate().then(function(status) {
        if (status == 'Valid') {
          var formData = new FormData(form);
          var body = {};
          formData.forEach(function(value, key) {
            body[key] = value;
          });

          fetch('http://127.0.0.1:8000/api/v1/users/updateMe', {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
            if (response.ok) {
              swal.fire({
                text: "Thank you! You've updated your basic info",
                icon: 'success',
                buttonsStyling: false,
                confirmButtonText: 'Ok, got it!',
                customClass: {
                  confirmButton: 'btn fw-bold btn-light-primary'
                }
              });

              location.reload(true);
            }
          });
        } else {
          swal.fire({
            text:
              'Sorry, looks like there are some errors detected, please try again.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Ok, got it!',
            customClass: {
              confirmButton: 'btn fw-bold btn-light-primary'
            }
          });
        }
      });
    });
  };

  // Public methods
  return {
    init: function() {
      form = document.getElementById('account_update_form');

      if (!form) {
        return;
      }

      submitButton = form.querySelector('#account_update_submit');

      initValidation();
      handleForm();
    }
  };
})();

// On document ready
KTUtil.onDOMContentLoaded(function() {
  KTAccountSettingsProfileDetails.init();
});

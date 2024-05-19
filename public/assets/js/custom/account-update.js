// Class definition
export const accountSettings = (function() {
  // Private letiables
  let form;
  let submitButton;
  let validation;

  // Private functions
  const initValidation = function() {
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
        // defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
        bootstrap: new FormValidation.plugins.Bootstrap5({
          rowSelector: '.fv-row',
          eleInvalidClass: '',
          eleValidClass: ''
        })
      }
    });
  };

  const handleForm = function() {
    submitButton.addEventListener('click', function(e) {
      e.preventDefault();

      validation.validate().then(function(status) {
        if (status === 'Valid') {
          const formData = new FormData(form);
          const body = {};
          formData.forEach(function(value, key) {
            body[key] = value;
          });

          fetch('/api/v1/users/updateMe', {
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

  const handleChangePassword = function() {
    // form elements
    const passwordForm = document.getElementById('update_password');

    if (!passwordForm) {
      return;
    }

    const passwordValidation = FormValidation.formValidation(passwordForm, {
      fields: {
        currentpassword: {
          validators: {
            notEmpty: {
              message: 'Current Password is required'
            }
          }
        },

        newpassword: {
          validators: {
            notEmpty: {
              message: 'New Password is required'
            },
            stringLength: {
              min: 8,
              message: 'Password must be at least 8 characters'
            }
          }
        },

        confirmpassword: {
          validators: {
            notEmpty: {
              message: 'Confirm Password is required'
            },
            identical: {
              compare: function() {
                return passwordForm.querySelector('[name="newpassword"]').value;
              },
              message: 'The password and its confirm are not the same'
            }
          }
        }
      },

      plugins: {
        // Learn more: https://formvalidation.io/guide/plugins
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap: new FormValidation.plugins.Bootstrap5({
          rowSelector: '.fv-row'
        })
      }
    });

    passwordForm
      .querySelector('#password_submit')
      .addEventListener('click', function(err) {
        err.preventDefault();

        passwordValidation.validate().then(function(status) {
          if (status === 'Valid') {
            const passwordFormData = new FormData(passwordForm);
            const inputData = {};

            passwordFormData.forEach(function(value, key) {
              if (key === 'currentpassword') {
                inputData['currentPassword'] = value;
              }
              if (key === 'newpassword') {
                inputData['newPassword'] = value;
              }
              if (key === 'confirmpassword') {
                inputData['newPasswordConfirm'] = value;
              }
            });

            fetch('/api/v1/users/updatePassword', {
              method: 'PATCH',
              body: JSON.stringify(inputData),
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(function(response) {
                if (response.ok) {
                  swal.fire({
                    text: 'Your password has successfully been reset.',
                    icon: 'success',
                    buttonsStyling: false,
                    confirmButtonText: 'Ok, got it!',
                    customClass: {
                      confirmButton: 'btn font-weight-bold btn-light-primary'
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
                      confirmButton: 'btn font-weight-bold btn-light-primary'
                    }
                  });
                }
              })
              .then(function() {
                passwordForm.reset();
                passwordValidation.resetForm(); // Reset formvalidation --- more info: https://formvalidation.io/guide/api/reset-form/
              });
          } else {
            swal.fire({
              text:
                'Sorry, looks like there are some errors detected, please try again.',
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn font-weight-bold btn-light-primary'
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
      handleChangePassword();
    }
  };
})();

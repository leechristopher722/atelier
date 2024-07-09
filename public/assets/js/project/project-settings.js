/* eslint-disable */

import axios from 'axios';

// Class definition
export const projectSettings = (function () {
  // Private letiables
  let form;
  let submitButton;
  let validation;

  // Private functions
  const initValidation = function () {
    const start_date = $(form.querySelector('[name="start_date"]'));
    start_date.flatpickr({
      altInput: true,
      enableTime: false,
      altFormat: 'd, M Y',
    });

    const due_date = $(form.querySelector('[name="due_date"]'));
    due_date.flatpickr({
      altInput: true,
      enableTime: false,
      altFormat: 'd, M Y',
    });

    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    validation = FormValidation.formValidation(form, {
      fields: {
        name: {
          validators: {
            notEmpty: {
              message: 'Project name is required',
            },
          },
        },
        summary: {
          validators: {
            notEmpty: {
              message: 'Project summary is required',
            },
            stringLength: {
              max: 80,
              message: 'Project summary must be less than 80 characters',
            },
          },
        },
        start_date: {
          validators: {
            notEmpty: {
              message: 'Start date is required',
            },
          },
        },
        due_date: {
          validators: {
            notEmpty: {
              message: 'Due date is required',
            },
          },
        },
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        submitButton: new FormValidation.plugins.SubmitButton(),
        bootstrap: new FormValidation.plugins.Bootstrap5({
          rowSelector: '.fv-row',
          eleInvalidClass: '',
          eleValidClass: '',
        }),
      },
    });
  };

  const handleForm = function () {
    submitButton.addEventListener('click', function (e) {
      e.preventDefault();

      validation.validate().then(async function (status) {
        if (status === 'Valid') {
          const formData = new FormData();
          formData.append('name', form.querySelector('[name="name"]').value);
          formData.append(
            'summary',
            form.querySelector('[name="summary"]').value,
          );
          formData.append(
            'description',
            form.querySelector('[name="description"]').value,
          );
          formData.append(
            'startDate',
            new Date(form.querySelector('[name="start_date"]').value),
          );
          formData.append(
            'dueDate',
            new Date(form.querySelector('[name="due_date"]').value),
          );

          formData.append(
            'status',
            form.querySelector('[name="status"]').value,
          );

          if (form.querySelector('[name="logo_remove"]').value) {
            formData.append('logo', 'blank.png');
          } else if (form.querySelector('[name="logo"]').files[0]) {
            formData.append(
              'logo',
              form.querySelector('[name="logo"]').files[0],
            );
          }

          const projectId = form.querySelector('#projectId').value;

          const res = await axios({
            method: 'PATCH',
            url: `/api/v1/projects/${projectId}`,
            data: formData,
          });

          if (res.data.status === 'success') {
            swal.fire({
              text: "Thank you! The project's settings have been updated.",
              icon: 'success',
              showConfirmButton: false,
            });

            location.reload(true);
          } else {
            swal.fire({
              text: 'Sorry. Looks like there are some errors detected, please try again.',
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn fw-bold btn-light-primary',
              },
            });
          }
        } else {
          swal.fire({
            text: 'Please complete the form with necessary conditions.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Ok, got it!',
            customClass: {
              confirmButton: 'btn fw-bold btn-light-primary',
            },
          });
        }
      });
    });
  };

  // Public methods
  return {
    init: function () {
      form = document.getElementById('project_settings_form');

      if (!form) {
        return;
      }

      submitButton = form.querySelector('#project_settings_submit');

      initValidation();
      handleForm();
    },
  };
})();

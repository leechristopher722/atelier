/* eslint-disable */

import axios from 'axios';

// Class definition
export const createProject = (function () {
  // Private letiables
  let form;
  let submitButton;
  let validation;

  // Private functions
  const initValidation = function () {
    const startDate = $(form.querySelector('[name="startDate"]'));
    startDate.flatpickr({
      altInput: true,
      enableTime: false,
      altFormat: 'd, M Y',
    });

    const dueDate = $(form.querySelector('[name="dueDate"]'));
    dueDate.flatpickr({
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
        startDate: {
          validators: {
            notEmpty: {
              message: 'Start date is required',
            },
          },
        },
        dueDate: {
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
          const formData = new FormData(form);

          // Handle logo uploads
          if (formData.get('logo').size === 0) {
            formData.delete('logo');
          }
          formData.delete('logo_remove');

          // Add current user as Admin
          const member = {};
          member.access = 'Admin';
          member.account = formData.get('account');
          formData.append('members', JSON.stringify([member]));
          formData.delete('account');

          // Set start and due date
          const start = new Date(formData.get('startDate'));
          const due = new Date(formData.get('dueDate'));
          formData.set('startDate', start.toISOString());
          formData.set('dueDate', due.toISOString());

          const res = await axios({
            method: 'POST',
            url: `/api/v1/projects/`,
            data: formData,
          });

          if (res.data.status === 'success') {
            swal.fire({
              text: 'Congrats! The project has been successfully created.',
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
            text: 'Please fill in the required fields.',
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
      form = document.getElementById('create_project_form');

      if (!form) {
        return;
      }

      submitButton = form.querySelector('#create_project_submit');

      initValidation();
      handleForm();
    },
  };
})();

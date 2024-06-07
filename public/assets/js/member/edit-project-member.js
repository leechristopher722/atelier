/* eslint-disable */

const editAccess = (el) => {
  const userId = el.dataset.value;

  const body = {};

  if (el.classList.contains('viewer')) {
    body['access'] = 'Viewer';
  } else if (el.classList.contains('member')) {
    body['access'] = 'Member';
  } else if (el.classList.contains('admin')) {
    body['access'] = 'Admin';
  }

  body['account'] = userId;

  fetch(`/api/v1/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify({ updateMemberAccess: body }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      // Handle response from server
      if (response.ok) {
        // Show success message. For more info check the plugin's official documentation: https://sweetalert2.github.io/
        Swal.fire({
          text: 'Access has been successfully modified!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        }).then(function () {
          // Handle success
          location.reload(true);
        });
      } else {
      }
    })
    .catch(function (error) {
      // Handle network or other errors
      console.error('Error:', error);
    });
};

const removeMember = (el) => {
  const userId = el.dataset.value;

  fetch(`/api/v1/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify({ removeMembers: [userId] }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      // Handle response from server
      if (response.ok) {
        // Show success message. For more info check the plugin's official documentation: https://sweetalert2.github.io/
        Swal.fire({
          text: 'Member has been successfully removed!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        }).then(function (result) {
          if (result.isConfirmed) {
            location.reload(true);
          }
        });
      } else {
      }
    })
    .catch(function (error) {
      // Handle network or other errors
      console.error('Error:', error);
    });
};

// DOM ELEMENTS
const editAccessBtns = document.querySelectorAll('.edit-access');
const removeMemberBtns = document.querySelectorAll('.remove-member');
const projectId = document.querySelector('#project-id').value;

// ACTIONS
// Delete Ticket
if (editAccessBtns) {
  editAccessBtns.forEach((el) =>
    el.addEventListener('click', () => editAccess(el)),
  );
}

// Update Ticket Status
if (removeMemberBtns) {
  removeMemberBtns.forEach((el) =>
    el.addEventListener('click', () => removeMember(el)),
  );
}

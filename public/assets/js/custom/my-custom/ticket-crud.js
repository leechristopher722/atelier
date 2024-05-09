const deleteTicketBtns = document.querySelectorAll('.delete--ticket');
const markTicketBtns = document.querySelectorAll('.mark-ticket');

if (deleteTicketBtns) {
  deleteTicketBtns.forEach(el =>
    el.addEventListener('click', () => deleteTicket(el))
  );
}

if (markTicketBtns) {
  markTicketBtns.forEach(el =>
    el.addEventListener('click', () => markTicketAs(el))
  );
}

const markTicketAs = el => {
  const ticketId = el.dataset.value;

  var body = {};

  if (el.classList.contains('created')) {
    body['status'] = 'created';
  } else if (el.classList.contains('in-progress')) {
    body['status'] = 'in_progress';
  } else if (el.classList.contains('completed')) {
    body['status'] = 'completed';
  }

  fetch(`http://127.0.0.1:8000/api/v1/tickets/${ticketId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function(response) {
      // Handle response from server
      if (response.ok) {
        // Show success message. For more info check the plugin's official documentation: https://sweetalert2.github.io/
        Swal.fire({
          text: 'Ticket has been successfully modified!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        }).then(function(result) {
          // Handle success
          location.reload(true);
        });
      } else {
        // Error occurred during form submission
        // Optionally, you can handle error response here
      }
    })
    .catch(function(error) {
      // Handle network or other errors
      console.error('Error:', error);
    });
};

const deleteTicket = el => {
  const ticketId = el.dataset.value;

  fetch(`http://127.0.0.1:8000/api/v1/tickets/${ticketId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function(response) {
      // Handle response from server
      if (response.ok) {
        // Show success message. For more info check the plugin's official documentation: https://sweetalert2.github.io/
        Swal.fire({
          text: 'Ticket has been successfully deleted!',
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

        location.reload(true);
      } else {
        // Error occurred during form submission
        // Optionally, you can handle error response here
      }
    })
    .catch(function(error) {
      // Handle network or other errors
      console.error('Error:', error);
    });
};

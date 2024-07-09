/* eslint-disable */

// Class definition
export const TicketComment = function (ticketId) {
  let commentContainer;
  let commentInput;
  let commentSubmitBtn;
  let commentMessages;
  let commentOpenBtn;

  let firstOpen;

  // Function to scroll to the bottom of the comment body
  function scrollToBottom() {
    commentMessages.scrollTop = commentMessages.scrollHeight;
  }

  function formatDateTime(date) {
    const formattedDate = date.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
    });
    const formattedTime = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${formattedDate} ${formattedTime}`;
  }

  const fetchData = () => {
    fetch(`/api/v1/tickets/${ticketId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((resData) => {
        commentMessages.innerHTML = ''; // Clear previous content
        resData.data.data.forEach((item) => {
          const listItem = document.createElement('div');

          const commentCreatedDateTime = formatDateTime(
            new Date(item.createdAt),
          );

          if (commentOpenBtn.dataset.value === item.createdBy._id) {
            listItem.innerHTML = `
            <div class="d-flex justify-content-end mb-4">
                <div class="d-flex flex-column align-items-end">
                  <div class="d-flex align-items-end mb-1">
                      <span class="text-muted fs-7 mb-1 me-3 flex-shrink-0">${commentCreatedDateTime}</span>
                      <div class="px-5 py-3 rounded bg-light-primary text-gray-900 fw-semibold mw-lg-400px text-end" data-kt-element="message-text">${item.content}</div>
                  </div>
                </div>
            </div>`;
          } else {
            listItem.innerHTML = `<!--begin::Message(in)-->
						<div class="d-flex justify-content-start mb-4">
							<!--begin::Wrapper-->
							<div class="d-flex flex-column align-items-start">
								<!--begin::User-->
								<div class="d-flex align-items-center mb-2">
									<!--begin::Avatar-->
									<div class="symbol symbol-25px symbol-circle">
										<img alt="Pic" src="assets/media/avatars/${item.createdBy.photo}" />
									</div>
									<!--end::Avatar-->
									<!--begin::Details-->
									<div class="ms-2">
										<div class="fs-5 fw-bold text-gray-900 me-1">${item.createdBy.name}</div>
									</div>
									<!--end::Details-->
								</div>
								<!--end::User-->
								<!--begin::Text-->
                <div class="d-flex align-items-end mb-1">
                  <div class="px-5 py-3 rounded bg-light-info text-gray-900 fw-semibold mw-lg-400px text-start" data-kt-element="message-text">${item.content}</div>
                  <span class="text-muted fs-7 mb-1 ms-3 flex-shrink-0">${commentCreatedDateTime}</span>
                </div>
								<!--end::Text-->
							</div>
							<!--end::Wrapper-->
						</div>
						<!--end::Message(in)-->`;
          }
          commentMessages.appendChild(listItem);
        });
        scrollToBottom();
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  // Private functions
  const initSettings = function () {
    // toggle UI
    commentOpenBtn.addEventListener('click', function () {
      commentContainer.classList.toggle('d-none');
      if (firstOpen && !commentContainer.classList.contains('d-none')) {
        firstOpen = false;
        fetchData();
      }
    });
  };

  const handleCommentInput = function () {
    commentSubmitBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const body = { content: commentInput.value };

      fetch(`/api/v1/tickets/${ticketId}/comments`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(function (response) {
        if (response.ok) {
          const listItem = document.createElement('div');

          const createdDateTime = formatDateTime(new Date());

          listItem.innerHTML = `
            <div class="d-flex justify-content-end mb-4">
                <div class="d-flex flex-column align-items-end">
                  <div class="d-flex align-items-end mb-1">
                      <span class="text-muted fs-7 mb-1 me-3 flex-shrink-0">${createdDateTime}</span>
                      <div class="px-5 py-3 rounded bg-light-primary text-gray-900 fw-semibold mw-lg-400px text-end" data-kt-element="message-text">${body.content}</div>
                  </div>
                </div>
            </div>`;
          commentMessages.appendChild(listItem);
          commentInput.value = '';
          const commentCount = document.getElementById(
            `comment_count_${ticketId}`,
          );
          commentCount.textContent = Number(commentCount.textContent) + 1;
          scrollToBottom();
        } else {
          swal.fire({
            text: 'Error occurred while saving your comment. Please try again next time.',
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
    init: function (button) {
      commentContainer = document.getElementById(
        `ticket_comment_container_${ticketId}`,
      );
      commentInput = document.getElementById(
        `ticket_comment_input_${ticketId}`,
      );
      commentSubmitBtn = document.getElementById(
        `ticket_comment_send_${ticketId}`,
      );
      commentMessages = document.getElementById(
        `ticket_comment_messages_${ticketId}`,
      );
      commentOpenBtn = button;

      firstOpen = true;

      initSettings();
      handleCommentInput();
    },
  };
};

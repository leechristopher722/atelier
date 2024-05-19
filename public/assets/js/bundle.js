(() => {
  // public/assets/js/custom/account-update.js
  var accountSettings = /* @__PURE__ */ function() {
    let form;
    let submitButton;
    let validation;
    const initValidation = function() {
      validation = FormValidation.formValidation(form, {
        fields: {
          name: {
            validators: {
              notEmpty: {
                message: "Name is required"
              }
            }
          },
          email: {
            validators: {
              notEmpty: {
                message: "Email is required"
              },
              emailAddress: {
                message: "The value is not a valid email address"
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row",
            eleInvalidClass: "",
            eleValidClass: ""
          })
        }
      });
    };
    const handleForm = function() {
      submitButton.addEventListener("click", function(e) {
        e.preventDefault();
        validation.validate().then(function(status) {
          if (status === "Valid") {
            const formData = new FormData(form);
            const body = {};
            formData.forEach(function(value, key) {
              body[key] = value;
            });
            fetch("/api/v1/users/updateMe", {
              method: "PATCH",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json"
              }
            }).then(function(response) {
              if (response.ok) {
                swal.fire({
                  text: "Thank you! You've updated your basic info",
                  icon: "success",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: {
                    confirmButton: "btn fw-bold btn-light-primary"
                  }
                });
                location.reload(true);
              }
            });
          } else {
            swal.fire({
              text: "Sorry, looks like there are some errors detected, please try again.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn fw-bold btn-light-primary"
              }
            });
          }
        });
      });
    };
    const handleChangePassword = function() {
      const passwordForm = document.getElementById("update_password");
      if (!passwordForm) {
        return;
      }
      const passwordValidation = FormValidation.formValidation(passwordForm, {
        fields: {
          currentpassword: {
            validators: {
              notEmpty: {
                message: "Current Password is required"
              }
            }
          },
          newpassword: {
            validators: {
              notEmpty: {
                message: "New Password is required"
              },
              stringLength: {
                min: 8,
                message: "Password must be at least 8 characters"
              }
            }
          },
          confirmpassword: {
            validators: {
              notEmpty: {
                message: "Confirm Password is required"
              },
              identical: {
                compare: function() {
                  return passwordForm.querySelector('[name="newpassword"]').value;
                },
                message: "The password and its confirm are not the same"
              }
            }
          }
        },
        plugins: {
          // Learn more: https://formvalidation.io/guide/plugins
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row"
          })
        }
      });
      passwordForm.querySelector("#password_submit").addEventListener("click", function(err) {
        err.preventDefault();
        passwordValidation.validate().then(function(status) {
          if (status === "Valid") {
            const passwordFormData = new FormData(passwordForm);
            const inputData = {};
            passwordFormData.forEach(function(value, key) {
              if (key === "currentpassword") {
                inputData["currentPassword"] = value;
              }
              if (key === "newpassword") {
                inputData["newPassword"] = value;
              }
              if (key === "confirmpassword") {
                inputData["newPasswordConfirm"] = value;
              }
            });
            fetch("/api/v1/users/updatePassword", {
              method: "PATCH",
              body: JSON.stringify(inputData),
              headers: {
                "Content-Type": "application/json"
              }
            }).then(function(response) {
              if (response.ok) {
                swal.fire({
                  text: "Your password has successfully been reset.",
                  icon: "success",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: {
                    confirmButton: "btn font-weight-bold btn-light-primary"
                  }
                });
              } else {
                swal.fire({
                  text: "Sorry, looks like there are some errors detected, please try again.",
                  icon: "error",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: {
                    confirmButton: "btn font-weight-bold btn-light-primary"
                  }
                });
              }
            }).then(function() {
              passwordForm.reset();
              passwordValidation.resetForm();
            });
          } else {
            swal.fire({
              text: "Sorry, looks like there are some errors detected, please try again.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn font-weight-bold btn-light-primary"
              }
            });
          }
        });
      });
    };
    return {
      init: function() {
        form = document.getElementById("account_update_form");
        if (!form) {
          return;
        }
        submitButton = form.querySelector("#account_update_submit");
        initValidation();
        handleForm();
        handleChangePassword();
      }
    };
  }();

  // public/assets/js/custom/ticket-deleteEdit.js
  var markTicketAs = (el) => {
    const ticketId = el.dataset.value;
    const body = {};
    if (el.classList.contains("created")) {
      body["status"] = "created";
    } else if (el.classList.contains("in-progress")) {
      body["status"] = "in_progress";
    } else if (el.classList.contains("completed")) {
      body["status"] = "completed";
    }
    fetch(`/api/v1/tickets/${ticketId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      if (response.ok) {
        Swal.fire({
          text: "Ticket has been successfully modified!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary"
          }
        }).then(function() {
          location.reload(true);
        });
      } else {
      }
    }).catch(function(error) {
      console.error("Error:", error);
    });
  };
  var deleteTicket = (el) => {
    const ticketId = el.dataset.value;
    fetch(`/api/v1/tickets/${ticketId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      if (response.ok) {
        Swal.fire({
          text: "Ticket has been successfully deleted!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary"
          }
        }).then(function(result) {
          if (result.isConfirmed) {
            modal.hide();
          }
        });
        location.reload(true);
      } else {
      }
    }).catch(function(error) {
      console.error("Error:", error);
    });
  };

  // public/assets/js/custom/ticket-update.js
  function KTModalUpdateTicket(modalEl, ticketId) {
    let submitButton;
    let cancelButton;
    let validator;
    let form;
    let modal2;
    const initForm = function() {
      const tags = new Tagify(form.querySelector('[name="tags"]'), {
        whitelist: ["Development", "Bug", "High", "Medium", "Low"],
        maxTags: 5,
        dropdown: {
          maxItems: 10,
          // <- mixumum allowed rendered suggestions
          enabled: 0,
          // <- show suggestions on focus
          closeOnSelect: false
          // <- do not hide the suggestions dropdown once an item has been selected
        }
      });
      tags.on("change", function() {
        validator.revalidateField("tags");
      });
      const dueDate = $(form.querySelector('[name="due_date"]'));
      dueDate.flatpickr({
        altInput: true,
        enableTime: true,
        altFormat: "d, M Y, H:i"
      });
      $(form.querySelector('[name="team_assign"]')).on("change", function() {
        validator.revalidateField("team_assign");
      });
    };
    const handleForm = function() {
      validator = FormValidation.formValidation(form, {
        fields: {
          target_title: {
            validators: {
              notEmpty: {
                message: "Ticket title is required"
              }
            }
          },
          target_assign: {
            validators: {
              notEmpty: {
                message: "Ticket assign is required"
              }
            }
          },
          due_date: {
            validators: {
              notEmpty: {
                message: "Ticket due date is required"
              }
            }
          },
          tags: {
            validators: {
              notEmpty: {
                message: "Ticket tags are required"
              }
            }
          },
          target_status: {
            validators: {
              notEmpty: {
                message: "Ticket status is required"
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row",
            eleInvalidClass: "",
            eleValidClass: ""
          })
        }
      });
      submitButton.addEventListener("click", function(e) {
        e.preventDefault();
        if (validator) {
          validator.validate().then(function(status) {
            if (status === "Valid") {
              submitButton.setAttribute("data-kt-indicator", "on");
              submitButton.disabled = true;
              setTimeout(function() {
                const formData = new FormData(form);
                const formDataObject = {};
                formData.forEach(function(value, key) {
                  if (key === "target_title") {
                    formDataObject["name"] = value;
                  } else if (key === "target_details") {
                    formDataObject["description"] = value;
                  } else if (key === "due_date") {
                    formDataObject["dueDate"] = new Date(value);
                  } else if (key === "tags") {
                    const tagsArray = [];
                    const tagsInput = JSON.parse(value);
                    for (let i = 0; i < tagsInput.length; i++) {
                      tagsArray.push(tagsInput[i].value);
                    }
                    formDataObject["tags"] = tagsArray;
                  } else if (key === "target_assign") {
                    if (formDataObject["assignedTo"]) {
                      formDataObject["assignedTo"].push(value);
                    } else {
                      formDataObject["assignedTo"] = [value];
                    }
                  } else if (key === "target_status") {
                    formDataObject["status"] = value;
                  }
                });
                fetch(`/api/v1/tickets/${ticketId}`, {
                  method: "PATCH",
                  body: JSON.stringify(formDataObject),
                  // Convert form data object to JSON string
                  headers: {
                    "Content-Type": "application/json"
                  }
                }).then(function(response) {
                  if (response.ok) {
                    Swal.fire({
                      text: "Ticket has been successfully updated!",
                      icon: "success",
                      buttonsStyling: false,
                      confirmButtonText: "Ok, got it!",
                      customClass: {
                        confirmButton: "btn btn-primary"
                      }
                    }).then(function(result) {
                      if (result.isConfirmed) {
                        modal2.hide();
                      }
                    });
                    submitButton.removeAttribute("data-kt-indicator");
                    submitButton.disabled = false;
                    location.reload(true);
                  } else {
                    Swal.fire({
                      text: "Sorry, looks like there are some errors detected, please try again.",
                      icon: "error",
                      buttonsStyling: false,
                      confirmButtonText: "Ok, got it!",
                      customClass: {
                        confirmButton: "btn btn-primary"
                      }
                    });
                  }
                }).catch(function(error) {
                  console.error("Error:", error);
                });
              }, 2e3);
            } else {
              Swal.fire({
                text: "Sorry, looks like there are some errors detected, please try again.",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary"
                }
              });
            }
          });
        }
      });
      cancelButton.addEventListener("click", function(e) {
        e.preventDefault();
        Swal.fire({
          text: "Are you sure you would like to cancel?",
          icon: "warning",
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonText: "Yes, cancel it!",
          cancelButtonText: "No, return",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-active-light"
          }
        }).then(function(result) {
          if (result.value) {
            form.reset();
            modal2.hide();
          } else if (result.dismiss === "cancel") {
            Swal.fire({
              text: "Your form has not been cancelled!.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary"
              }
            });
          }
        });
      });
    };
    return {
      // Public functions
      init: function() {
        if (!modalEl) {
          return;
        }
        modal2 = new bootstrap.Modal(modalEl);
        form = document.querySelector(`#kt_modal_update_ticket_form_${ticketId}`);
        submitButton = document.getElementById(
          `kt_modal_update_ticket_submit_${ticketId}`
        );
        cancelButton = document.getElementById(
          `kt_modal_update_ticket_cancel_${ticketId}`
        );
        initForm();
        handleForm();
      }
    };
  }

  // public/assets/js/custom/ticket-create.js
  var KTModalNewTarget = /* @__PURE__ */ function() {
    let submitButton;
    let cancelButton;
    let validator;
    let form;
    let modal2;
    let modalEl;
    const initForm = function() {
      const tags = new Tagify(form.querySelector('[name="tags"]'), {
        whitelist: ["Development", "Bug", "High", "Medium", "Low"],
        maxTags: 5,
        dropdown: {
          maxItems: 10,
          // <- mixumum allowed rendered suggestions
          enabled: 0,
          // <- show suggestions on focus
          closeOnSelect: false
          // <- do not hide the suggestions dropdown once an item has been selected
        }
      });
      tags.on("change", function() {
        validator.revalidateField("tags");
      });
      const due_date = $(form.querySelector('[name="due_date"]'));
      due_date.flatpickr({
        altInput: true,
        enableTime: true,
        altFormat: "d, M Y, H:i"
      });
      $(form.querySelector('[name="team_assign"]')).on("change", function() {
        validator.revalidateField("team_assign");
      });
    };
    const handleForm = function() {
      validator = FormValidation.formValidation(form, {
        fields: {
          target_title: {
            validators: {
              notEmpty: {
                message: "Ticket title is required"
              }
            }
          },
          target_assign: {
            validators: {
              notEmpty: {
                message: "Ticket assign is required"
              }
            }
          },
          due_date: {
            validators: {
              notEmpty: {
                message: "Ticket due date is required"
              }
            }
          },
          target_tags: {
            validators: {
              notEmpty: {
                message: "Ticket tags are required"
              }
            }
          },
          "targets_notifications[]": {
            validators: {
              notEmpty: {
                message: "Please select at least one communication method"
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row",
            eleInvalidClass: "",
            eleValidClass: ""
          })
        }
      });
      submitButton.addEventListener("click", function(e) {
        e.preventDefault();
        if (validator) {
          validator.validate().then(function(status) {
            console.log("validated!");
            if (status === "Valid") {
              submitButton.setAttribute("data-kt-indicator", "on");
              submitButton.disabled = true;
              setTimeout(function() {
                const formData = new FormData(form);
                const formDataObject = {};
                formData.forEach(function(value, key) {
                  if (key === "target_title") {
                    formDataObject["name"] = value;
                  } else if (key === "target_details") {
                    formDataObject["description"] = value;
                  } else if (key === "due_date") {
                    formDataObject["dueDate"] = new Date(value);
                  } else if (key === "tags") {
                    const tagsArray = [];
                    const tagsInput = JSON.parse(value);
                    for (let i = 0; i < tagsInput.length; i++) {
                      tagsArray.push(tagsInput[i].value);
                    }
                    formDataObject["tags"] = tagsArray;
                  } else if (key === "project_id") {
                    formDataObject["project"] = value;
                  } else if (key === "target_assign") {
                    if (formDataObject["assignedTo"]) {
                      formDataObject["assignedTo"].push(value);
                    } else {
                      formDataObject["assignedTo"] = [value];
                    }
                  }
                });
                formDataObject["status"] = "created";
                fetch("/api/v1/tickets", {
                  method: "POST",
                  body: JSON.stringify(formDataObject),
                  // Convert form data object to JSON string
                  headers: {
                    "Content-Type": "application/json"
                  }
                }).then(function(response) {
                  if (response.ok) {
                    Swal.fire({
                      text: "Ticket has been successfully created!",
                      icon: "success",
                      buttonsStyling: false,
                      confirmButtonText: "Ok, got it!",
                      customClass: {
                        confirmButton: "btn btn-primary"
                      }
                    }).then(function(result) {
                      if (result.isConfirmed) {
                        modal2.hide();
                      }
                    });
                    submitButton.removeAttribute("data-kt-indicator");
                    submitButton.disabled = false;
                    location.reload(true);
                  } else {
                  }
                }).catch(function(error) {
                  console.error("Error:", error);
                });
              }, 2e3);
            } else {
              Swal.fire({
                text: "Sorry, looks like there are some errors detected, please try again.",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary"
                }
              });
            }
          });
        }
      });
      cancelButton.addEventListener("click", function(e) {
        e.preventDefault();
        Swal.fire({
          text: "Are you sure you would like to cancel?",
          icon: "warning",
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonText: "Yes, cancel it!",
          cancelButtonText: "No, return",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-active-light"
          }
        }).then(function(result) {
          if (result.value) {
            form.reset();
            modal2.hide();
          } else if (result.dismiss === "cancel") {
            Swal.fire({
              text: "Your form has not been cancelled!.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary"
              }
            });
          }
        });
      });
    };
    return {
      // Public functions
      init: function() {
        modalEl = document.querySelector("#kt_modal_new_target");
        if (!modalEl) {
          return;
        }
        modal2 = new bootstrap.Modal(modalEl);
        form = document.querySelector("#kt_modal_new_target_form");
        submitButton = document.getElementById("kt_modal_new_target_submit");
        cancelButton = document.getElementById("kt_modal_new_target_cancel");
        initForm();
        handleForm();
      }
    };
  }();

  // public/assets/js/custom/ticket-comment.js
  function TicketComment(ticketId) {
    let commentContainer;
    let commentInput;
    let commentSubmitBtn;
    let commentMessages;
    let commentOpenBtn;
    let firstOpen;
    function scrollToBottom() {
      commentMessages.scrollTop = commentMessages.scrollHeight;
    }
    function formatDateTime(date) {
      const formattedDate = date.toLocaleDateString(void 0, {
        month: "short",
        day: "2-digit"
      });
      const formattedTime = date.toLocaleTimeString(void 0, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
      return `${formattedDate} ${formattedTime}`;
    }
    const fetchData = () => {
      fetch(`/api/v1/tickets/${ticketId}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }).then((resData) => {
        commentMessages.innerHTML = "";
        resData.data.data.forEach((item) => {
          const listItem = document.createElement("div");
          const commentCreatedDateTime = formatDateTime(
            new Date(item.createdAt)
          );
          if (commentOpenBtn.dataset.value === item.createdBy._id) {
            listItem.innerHTML = `
            <div class="d-flex justify-content-end mb-5">
                <div class="d-flex flex-column align-items-end">
                    <div class="d-flex align-items-center mb-2">
                        <div class="me-3">
                            <span class="text-muted fs-7 mb-1">${commentCreatedDateTime}</span>
                            <a class="fs-5 fw-bold text-gray-900 text-hover-primary ms-1" href="#">You</a>
                        </div>
                        <div class="symbol symbol-35px symbol-circle">
                            <img alt="Pic" src="assets/media/avatars/300-1.jpg">
                        </div>
                    </div>
                    <div class="p-5 rounded bg-light-primary text-gray-900 fw-semibold mw-lg-400px text-end" data-kt-element="message-text">${item.content}</div>
                </div>
            </div>`;
          } else {
            listItem.innerHTML = `<!--begin::Message(in)-->
						<div class="d-flex justify-content-start mb-5">
							<!--begin::Wrapper-->
							<div class="d-flex flex-column align-items-start">
								<!--begin::User-->
								<div class="d-flex align-items-center mb-2">
									<!--begin::Avatar-->
									<div class="symbol symbol-35px symbol-circle">
										<img alt="Pic" src="assets/media/avatars/300-25.jpg" />
									</div>
									<!--end::Avatar-->
									<!--begin::Details-->
									<div class="ms-3">
										<a href="#" class="fs-5 fw-bold text-gray-900 text-hover-primary me-1">${item.createdBy.name}</a>
										<span class="text-muted fs-7 mb-1">${commentCreatedDateTime}</span>
									</div>
									<!--end::Details-->
								</div>
								<!--end::User-->
								<!--begin::Text-->
								<div class="p-5 rounded bg-light-info text-gray-900 fw-semibold mw-lg-400px text-start" data-kt-element="message-text">${item.content}</div>
								<!--end::Text-->
							</div>
							<!--end::Wrapper-->
						</div>
						<!--end::Message(in)-->`;
          }
          commentMessages.appendChild(listItem);
        });
        scrollToBottom();
      }).catch((error) => {
        console.error("Error fetching data:", error);
      });
    };
    const initSettings = function() {
      commentOpenBtn.addEventListener("click", function() {
        commentContainer.classList.toggle("d-none");
        if (firstOpen && !commentContainer.classList.contains("d-none")) {
          firstOpen = false;
          fetchData();
        }
      });
    };
    const handleCommentInput = function() {
      commentSubmitBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const body = { content: commentInput.value };
        fetch(`/api/v1/tickets/${ticketId}/comments`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json"
          }
        }).then(function(response) {
          if (response.ok) {
            const listItem = document.createElement("div");
            const createdDateTime = formatDateTime(/* @__PURE__ */ new Date());
            listItem.innerHTML = `
          <div class="d-flex justify-content-end mb-10">
              <div class="d-flex flex-column align-items-end">
                  <div class="d-flex align-items-center mb-2">
                      <div class="me-3">
                          <span class="text-muted fs-7 mb-1">${createdDateTime}</span>
                          <a class="fs-5 fw-bold text-gray-900 text-hover-primary ms-1" href="#">You</a>
                      </div>
                      <div class="symbol symbol-35px symbol-circle">
                          <img alt="Pic" src="assets/media/avatars/300-1.jpg">
                      </div>
                  </div>
                  <div class="p-5 rounded bg-light-primary text-gray-900 fw-semibold mw-lg-400px text-end" data-kt-element="message-text">${body.content}</div>
              </div>
          </div>`;
            commentMessages.appendChild(listItem);
            commentInput.value = "";
            const commentCount = document.getElementById(
              `comment_count_${ticketId}`
            );
            commentCount.textContent = Number(commentCount.textContent) + 1;
            scrollToBottom();
          } else {
            swal.fire({
              text: "Error occurred while saving your comment. Please try again next time.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn fw-bold btn-light-primary"
              }
            });
          }
        });
      });
    };
    return {
      init: function(button) {
        commentContainer = document.getElementById(
          `ticket_comment_container_${ticketId}`
        );
        commentInput = document.getElementById(
          `ticket_comment_input_${ticketId}`
        );
        commentSubmitBtn = document.getElementById(
          `ticket_comment_send_${ticketId}`
        );
        commentMessages = document.getElementById(
          `ticket_comment_messages_${ticketId}`
        );
        commentOpenBtn = button;
        firstOpen = true;
        initSettings();
        handleCommentInput();
      }
    };
  }

  // public/assets/js/index.js
  var deleteTicketBtns = document.querySelectorAll(".delete--ticket");
  var markTicketBtns = document.querySelectorAll(".mark-ticket");
  if (deleteTicketBtns) {
    deleteTicketBtns.forEach(
      (el) => el.addEventListener("click", () => deleteTicket(el))
    );
  }
  if (markTicketBtns) {
    markTicketBtns.forEach(
      (el) => el.addEventListener("click", () => markTicketAs(el))
    );
  }
  KTUtil.onDOMContentLoaded(function() {
    accountSettings.init();
    KTModalNewTarget.init();
    const commentOpenBtns = document.querySelectorAll(
      '[id^="ticket_comment_view_"]'
    );
    commentOpenBtns.forEach(function(el) {
      const ticketId = el.id.replace("ticket_comment_view_", "");
      const ticketCommentInstance = new TicketComment(ticketId);
      ticketCommentInstance.init(el);
    });
    const modalEls = document.querySelectorAll(
      '[id^="kt_modal_update_ticket_modal_"]'
    );
    modalEls.forEach((el) => {
      const ticketId = el.id.replace("kt_modal_update_ticket_modal_", "");
      const modalInstance = new KTModalUpdateTicket(el, ticketId);
      modalInstance.init();
    });
  });
})();

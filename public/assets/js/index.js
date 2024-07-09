/* eslint-disable */

import { accountSettings } from './account-update';
import { deleteTicket, markTicketAs } from './ticket/ticket-deleteEdit';
import { ModalUpdateTicket } from './ticket/ticket-update';
import { ModalNewTicket } from './ticket/ticket-create';
import { TicketComment } from './ticket/ticket-comment';
import { logout } from './authentication/sign-out';
import { createProject } from './project/project-create';
import { projectSettings } from './project/project-settings';
import { projectOverview } from './project/project';
import { ModalUserSearch } from './member/add-project-member';
import { editAccess, removeMember } from './member/edit-project-member';

// DOM ELEMENTS
const deleteTicketBtns = document.querySelectorAll('.delete--ticket');
const markTicketBtns = document.querySelectorAll('.mark-ticket');
const logoutButton = document.querySelector('#logout_button');
const editAccessBtns = document.querySelectorAll('.edit-access');
const removeMemberBtns = document.querySelectorAll('.remove-member');

// ACTIONS
// Delete Ticket
if (deleteTicketBtns) {
  deleteTicketBtns.forEach((el) =>
    el.addEventListener('click', () => deleteTicket(el)),
  );
}

// Update Ticket Status
if (markTicketBtns) {
  markTicketBtns.forEach((el) =>
    el.addEventListener('click', () => markTicketAs(el)),
  );
}

// Update Member Access
if (editAccessBtns) {
  editAccessBtns.forEach((el) =>
    el.addEventListener('click', () => editAccess(el)),
  );
}

// Remove Member
if (removeMemberBtns) {
  removeMemberBtns.forEach((el) =>
    el.addEventListener('click', () => removeMember(el)),
  );
}

// Sign Out
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

KTUtil.onDOMContentLoaded(function () {
  // Account Settings
  accountSettings.init();

  // Project Overview
  projectOverview.init();

  // Create Project
  createProject.init();

  // Project Settings
  projectSettings.init();

  // Create Ticket
  ModalNewTicket.init();

  // Add Project Member
  ModalUserSearch.init();

  // Ticket Comment
  const commentOpenBtns = document.querySelectorAll(
    '[id^="ticket_comment_view_"]',
  );
  commentOpenBtns.forEach(function (el) {
    const ticketId = el.id.replace('ticket_comment_view_', '');
    const ticketCommentInstance = new TicketComment(ticketId);
    ticketCommentInstance.init(el);
  });

  // Update Ticket
  const modalEls = document.querySelectorAll(
    '[id^="kt_modal_update_ticket_modal_"]',
  );
  modalEls.forEach((el) => {
    const ticketId = el.id.replace('kt_modal_update_ticket_modal_', '');
    const modalInstance = new ModalUpdateTicket(el, ticketId);
    modalInstance.init();
  });
});

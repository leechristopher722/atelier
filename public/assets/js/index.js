import { accountSettings } from "./custom/account-update";
import { deleteTicket } from "./custom/ticket-deleteEdit";
import { markTicketAs } from "./custom/ticket-deleteEdit";
import { KTModalUpdateTicket } from "./custom/ticket-update";
import { KTModalNewTarget } from "./custom/ticket-create";
import { TicketComment } from "./custom/ticket-comment";

// DOM ELEMENTS
const deleteTicketBtns = document.querySelectorAll('.delete--ticket');
const markTicketBtns = document.querySelectorAll('.mark-ticket');

// ACTIONS
// Delete Ticket
if (deleteTicketBtns) {
  deleteTicketBtns.forEach(el =>
    el.addEventListener('click', () => deleteTicket(el))
  );
}

// Update Ticket Status
if (markTicketBtns) {
  markTicketBtns.forEach(el =>
    el.addEventListener('click', () => markTicketAs(el))
  );
}

KTUtil.onDOMContentLoaded(function() {
  // Account Settings
  accountSettings.init();

  // Create Ticket
  KTModalNewTarget.init();

  // Ticket Comment
  const commentOpenBtns = document.querySelectorAll(
    '[id^="ticket_comment_view_"]'
  );
  commentOpenBtns.forEach(function(el) {
    const ticketId = el.id.replace('ticket_comment_view_', '');
    const ticketCommentInstance = new TicketComment(ticketId);
    ticketCommentInstance.init(el);
  });

  // Update Ticket
  const modalEls = document.querySelectorAll(
    '[id^="kt_modal_update_ticket_modal_"]'
  );
  modalEls.forEach(el => {
    const ticketId = el.id.replace('kt_modal_update_ticket_modal_', '');
    const modalInstance = new KTModalUpdateTicket(el, ticketId);
    modalInstance.init();
  });
});
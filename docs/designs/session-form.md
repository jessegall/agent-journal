# Session form

How the session form starts, resumes or switches the chosen agent's session
(`domain/Chat/resources/js/pages/chat/partials/SessionForm.vue`).

- It asks for the driver, the model among those the profile permits, the registered driver (its terminal or headless
  driver type kept for the agent when asked), the account among those the driver may run with, and for a resume the
  conversation it continues.
- The form makes one request id when it opens, so a second press repeats the same start; an edit after a refusal makes
  a fresh one. Every id comes from the dialog's own mount, so two open dialogs never share one.
- A refusal whose next step is a field shows under that field and takes the focus; every other choice stays.
- A start ends once the host confirms its session's process exists, whatever it does then. A lost reply is recovered by
  reading the start's receipt by its key, never by posting again.
- The tab keeps the dialog's choices and request id, so a reload shows the same start; closing the dialog forgets them.
- A start reads Ready only once the host runs it, and shows the host's refusal when its start was refused; a switch shows
  each stage it passes until it ends.

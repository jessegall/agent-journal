from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.models.message import Message
from journal.support.typed_lines import TypedLines
from journal.supervisor_link import SupervisorLink


class ConfirmRead(Listener[Updated]):
    """A message read is a new-message line arrived: the agent acted on it, so the line naming the message is confirmed whatever the prompt hook saw, and the next held line goes in."""

    def __init__(self, keystrokes: TypedLines, supervisor: SupervisorLink) -> None:
        self.typed, self.supervisor = keystrokes, supervisor

    def handle(self, event: Updated) -> None:
        message = event.model
        if not isinstance(message, Message) or message.read_at is None or (event.previous is not None and event.previous.read_at is not None):
            return
        if self.typed.confirm_naming(message.environment_id, message.id):
            self.supervisor.release(message.environment_id)

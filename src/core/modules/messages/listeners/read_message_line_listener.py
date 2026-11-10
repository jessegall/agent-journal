from engine.change.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.support.waiting_message_lines import WaitingMessageLines
from core.modules.messages.support.message_targets import MessageTargets
from engine.change.updated import Updated

READ_FIELD = "read_at"


class ReadMessageLineListener(CommitListener[Updated[Message]]):
    """A message the agent read is no longer told of: the lines still waiting to tell the main agent of it are
    dropped, so no hook gives them after the read."""

    name = "messages.read-message-line"

    def __init__(self, lines: WaitingMessageLines, targets: MessageTargets) -> None:
        self.lines = lines
        self.targets = targets

    def handle(self, event: Updated[Message], logged: LoggedEvent) -> None:
        if READ_FIELD not in logged.data:
            return
        message = event.row
        if message.type not in PERSON_MESSAGE_TYPES or message.read_at is None:
            return
        agent = self.targets.recipient(message)
        if agent is None:
            return
        for line in tuple(self.lines.waiting(agent.id).all_rows()):
            if self.lines.names(line, message):
                self.lines.drop(line, logged)

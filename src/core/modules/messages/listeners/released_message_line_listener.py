from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.lifecycles.agent_line_lifecycle import AgentLineLifecycle
from core.modules.messages.support.waiting_message_lines import WAITING_MESSAGE_SOURCE, WaitingMessageLines


class ReleasedMessageLineListener(CommitListener[Moved[AgentLine]]):
    """A line that tells of a message and waits again after its typing stopped, as when the server stopped
    during it, is dropped when the message was read meanwhile, so no hook tells of a read message."""

    name = "messages.released-message-line"
    moves = (AgentLineLifecycle.release,)

    def __init__(self, lines: WaitingMessageLines) -> None:
        self.lines = lines

    def handle(self, event: Moved[AgentLine], logged: LoggedEvent) -> None:
        line = event.row
        if line.source != WAITING_MESSAGE_SOURCE:
            return
        message = self.lines.waking_message(line.session_agent_id)
        if message is None or not self.lines.names(line, message):
            self.lines.drop(line, logged)

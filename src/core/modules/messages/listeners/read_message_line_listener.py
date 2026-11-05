from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.support.waiting_message_lines import WaitingMessageLines
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.base.change.updated import Updated

READ_FIELD = "read_at"


class ReadMessageLineListener(CommitListener[Updated[Message]]):
    """A message the agent read is no longer told of: the lines still waiting to tell the main agent of it are
    dropped, so no hook gives them after the read."""

    name = "messages.read-message-line"

    def __init__(self, queries: Queries, lines: WaitingMessageLines) -> None:
        self.queries, self.lines = queries, lines

    def handle(self, event: Updated[Message], logged: LoggedEvent) -> None:
        if READ_FIELD not in logged.data:
            return
        message = event.row
        if message.type not in PERSON_MESSAGE_TYPES or message.read_at is None:
            return
        for agent in MainAgentFinder.rows(self.queries, message.environment_id):
            for line in tuple(self.lines.waiting(agent.id).all_rows()):
                if self.lines.names(line, message):
                    self.lines.drop(line, logged)

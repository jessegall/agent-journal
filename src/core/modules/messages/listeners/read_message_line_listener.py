from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.messages.support.waiting_message_lines import WaitingMessageLines

READ_FIELD = "read_at"


class ReadMessageLineListener(CommitListener):
    """A message the agent read is no longer told of: the lines still waiting to tell the main agent of it are
    dropped, so no hook gives them after the read."""

    name = "messages.read-message-line"
    event = "message.update"

    def __init__(self, queries: Queries, lines: WaitingMessageLines) -> None:
        self.queries, self.lines = queries, lines

    def handle(self, event: LoggedEvent) -> None:
        if READ_FIELD not in event.data:
            return
        message = self.queries.query(Message).find(event.row_id)
        if message.type not in PERSON_MESSAGE_TYPES or message.read_at is None:
            return
        for agent in self.queries.query(Agent).filter(environment_id=message.environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).all_rows():
            for line in tuple(self.lines.waiting(agent.id).all_rows()):
                if self.lines.names(line, message):
                    self.lines.drop(line, event)

from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder

MOVE_FILE = "move"


class WaitingMessageRunListener(CommitListener):
    """A person's message moves the main agent's foreground run to the background at once, through a file its runner
    watches, so the agent can read the message without waiting for the run."""

    name = "processes.waiting-message-run"
    event = "message.create"

    def __init__(self, queries: Queries, processes: ProcessQuery, folder: OutputFolder) -> None:
        self.queries, self.processes, self.folder = queries, processes, folder

    def handle(self, event: LoggedEvent) -> None:
        message = self.queries.query(Message).find(event.row_id)
        if message.type not in PERSON_MESSAGE_TYPES:
            return
        for process in tuple(self.processes.environment(message.environment_id).filter(state=ProcessState.RUNNING).all_rows()):
            if self.queries.query(Agent).find(process.agent_id).role == AgentRole.MAIN:
                self.folder.write(process.id, MOVE_FILE, "1")

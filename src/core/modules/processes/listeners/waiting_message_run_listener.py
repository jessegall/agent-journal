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
from core.base.change.created import Created
from core.modules.messages.support.message_targets import MessageTargets

MOVE_FILE = "move"


class WaitingMessageRunListener(CommitListener[Created[Message]]):
    """A person's message moves the main agent's foreground run to the background at once, through a file its runner
    watches, so the agent can read the message without waiting for the run."""

    name = "processes.waiting-message-run"

    def __init__(self, targets: MessageTargets, processes: ProcessQuery, folder: OutputFolder) -> None:
        self.targets, self.processes, self.folder = targets, processes, folder

    def handle(self, event: Created[Message], logged: LoggedEvent) -> None:
        message = event.row
        if message.type not in PERSON_MESSAGE_TYPES:
            return
        target = self.targets.recipient(message)
        if target is None:
            return
        for process in tuple(self.processes.environment(message.environment_id).filter(agent_id=target.id, state=ProcessState.RUNNING).all_rows()):
            self.folder.write(process.id, MOVE_FILE, "1")

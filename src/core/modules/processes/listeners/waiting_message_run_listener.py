from engine.change.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.database.kept_rows import KeptRows
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.message import Message
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from engine.change.created import Created
from core.modules.messages.support.message_targets import MessageTargets



class WaitingMessageRunListener(CommitListener[Created[Message]]):
    """A person's message moves the main agent's foreground run to the background at once, through a file its runner
    watches, so the agent can read the message without waiting for the run."""

    name = "processes.waiting-message-run"

    def __init__(self, targets: MessageTargets, processes: ProcessQuery, folder: OutputFolder, kept: KeptRows) -> None:
        self.targets, self.processes, self.folder = targets, processes, folder
        self.kept = kept

    def handle(self, event: Created[Message], logged: LoggedEvent) -> None:
        message = event.row
        if message.type not in PERSON_MESSAGE_TYPES:
            return
        target = self.targets.recipient(message)
        if target is None:
            return
        processes = self.kept.scoped_read("processes", lambda: tuple(self.processes.agent(target.id).filter(state=ProcessState.RUNNING).all_rows()),
                                            "session_agent_id = ? AND state = ?", [target.id, ProcessState.RUNNING], name="processes.message_foreground_runs")
        for process in processes:
            self.folder.ask_move(process.id)

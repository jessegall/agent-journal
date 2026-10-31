from core.base.change.logged_event import LoggedEvent
from core.base.chat.mark_outcome import MarkOutcome
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from core.modules.processes.models.enums.process_mark_type import ProcessMarkType
from core.modules.processes.models.enums.process_mark_variant import ProcessMarkVariant
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process

MODULE_NAME = "journal.core.processes"
LINE_CHARACTERS = 70
OUTCOMES = {ProcessState.FINISHED: MarkOutcome.PASSED, ProcessState.FAILED: MarkOutcome.FAILED, ProcessState.STOPPED: MarkOutcome.WARNED, ProcessState.LOST: MarkOutcome.FAILED}
WORDS = {ProcessState.RUNNING: "Running", ProcessState.BACKGROUND: "In the background", ProcessState.FINISHED: "Ran", ProcessState.FAILED: "Failed",
         ProcessState.STOPPED: "Stopped", ProcessState.LOST: "Lost"}
ENDED = (ProcessState.FINISHED, ProcessState.FAILED, ProcessState.STOPPED, ProcessState.LOST)


class ProcessEndMarkListener(CommitListener):
    """A run shows one mark, kept up to date in place by the key process:<id>: running, with the reader's progress as
    its figure, moved to the background, then ended with its outcome."""

    name = "processes.process-mark"
    event = "process.*"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: LoggedEvent) -> None:
        process = self.queries.query(Process).find(event.row_id)
        key = f"process:{process.id}"
        shown = next(self.queries.query(ChatMark).filter(environment_id=process.environment_id, key=key).all_rows(), None)
        if shown is not None and shown.state is ChatMarkState.ENDED:
            return
        variant = ProcessMarkVariant(process.state.value)
        figure = f"{process.progress}%" if process.progress and process.state not in ENDED else ""
        self.bus.run(ShowMark(process.environment_id, ProcessMarkType.COMMAND, variant, key, f"{WORDS[process.state]} {process.line[:LINE_CHARACTERS]}", agent_id=process.agent_id,
                              row_model="process", row_id=process.id, outcome=OUTCOMES.get(process.state, MarkOutcome.RUNNING), figure=figure,
                              fraction=process.progress / 100 if process.state not in ENDED else 0.0, ended=process.state in ENDED),
                     self.actors.actor(MODULE_NAME), cause_id=event.id, environment_id=process.environment_id)

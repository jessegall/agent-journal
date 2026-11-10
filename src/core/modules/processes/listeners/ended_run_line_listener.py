from engine.change.moved import Moved
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_nudges import OUTPUT_ENDED

LINE_SOURCE = "processes.output-ended"


class EndedRunLineListener(SaveListener[Moved[Process]]):
    """A run an agent moved to the background that finishes or fails leaves the agent a line that wakes it,
    since an agent that stopped sends no hook that could carry the news."""

    name = "processes.ended-run-line"
    moves = (ProcessLifecycle.finish, ProcessLifecycle.fail)

    def __init__(self, nudger: Nudger) -> None:
        self.nudger = nudger

    def handle(self, event: Moved[Process], context: Context) -> None:
        process = event.row
        if process.moved_at is not None:
            self.nudger.send(process.session_agent_id, OUTPUT_ENDED, LINE_SOURCE, context, output=process.id)

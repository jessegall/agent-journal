from engine.command.context import Context
from engine.event.created import Created
from engine.listener.save_listener import SaveListener
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.support.decisions.command_run_counts import CommandRunCounts
from core.modules.processes.support.unreadable.unreadable_marks import UnreadableMarks


class UnreadableMarkRunCountResetListener(SaveListener[Created[UnreadableMark]]):
    """A mark that a command's output cannot be read sets the run count of every command it covers back to zero."""

    name = "processes.unreadable-mark-run-count-reset"

    def __init__(self, run_counts: CommandRunCounts) -> None:
        self.run_counts = run_counts

    def handle(self, event: Created[UnreadableMark], context: Context) -> None:
        self.run_counts.reset(lambda command_key: UnreadableMarks.covers(event.row.words, command_key), context)

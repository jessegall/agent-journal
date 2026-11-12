from engine.command.context import Context
from engine.event.created import Created
from engine.event.updated import Updated
from engine.listener.save_listener import SaveListener
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.decisions.command_run_counts import CommandRunCounts
from core.modules.processes.support.reader_selection import ReaderSelection


class ReaderRunCountResetListener(SaveListener[Created[Reader] | Updated[Reader]]):
    """A reader saved or changed sets the run count of every command it reads back to zero."""

    name = "processes.reader-run-count-reset"

    def __init__(self, run_counts: CommandRunCounts) -> None:
        self.run_counts = run_counts

    def handle(self, event: Created[Reader] | Updated[Reader], context: Context) -> None:
        self.run_counts.reset(lambda command_key: ReaderSelection.matches(event.row.commands, command_key), context)

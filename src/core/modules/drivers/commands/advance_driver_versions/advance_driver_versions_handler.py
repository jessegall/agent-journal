from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.commands.advance_driver_versions.advance_driver_versions import AdvanceDriverVersions
from core.modules.drivers.support.read_versions_writers import ReadVersionsWriters


class AdvanceDriverVersionsHandler(Handler[AdvanceDriverVersions, None]):
    """Moves every environment's driver epoch in one write and records when the journal started."""

    command = AdvanceDriverVersions

    def __init__(self, writers: ReadVersionsWriters) -> None:
        self.writers = writers

    def handle(self, command: AdvanceDriverVersions, context: Context) -> None:
        self.writers.record_journal_start(context)

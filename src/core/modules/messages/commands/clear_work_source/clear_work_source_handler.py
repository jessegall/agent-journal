from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.messages.commands.clear_work_source.clear_work_source import ClearWorkSource
from core.modules.messages.support.work_sources import WorkSources


class ClearWorkSourceHandler(Handler[ClearWorkSource, None]):
    """Clears the request while preserving its selection version."""

    command = ClearWorkSource

    def __init__(self, sources: WorkSources) -> None:
        self.sources = sources

    def handle(self, command: ClearWorkSource, context: Context) -> None:
        self.sources.clear(context)

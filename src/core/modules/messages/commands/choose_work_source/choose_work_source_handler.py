from engine.command.context import Context
from engine.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.modules.messages.commands.choose_work_source.choose_work_source import ChooseWorkSource
from core.modules.messages.models.enums.work_source_origin import WorkSourceOrigin
from core.modules.messages.models.message import Message
from core.modules.messages.models.message_work_source import MessageWorkSource
from core.modules.messages.support.work_sources import WorkSources


class ChooseWorkSourceHandler(Handler[ChooseWorkSource, MessageWorkSource]):
    """Selects a request without requiring it to be unread."""

    command = ChooseWorkSource

    def __init__(self, sources: WorkSources, rows: EventRows) -> None:
        self.sources, self.rows = sources, rows

    def handle(self, command: ChooseWorkSource, context: Context) -> MessageWorkSource:
        return self.sources.select(self.rows.required(Message, command.message_id), WorkSourceOrigin.EXPLICIT, context)

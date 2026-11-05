from dataclasses import replace

from core.base.actor import CORE_ACTOR_ID
from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.processes.commands.update_stock_readers.update_stock_readers import UpdateStockReaders
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.stock_reader import STOCK_READERS, StockReader


class UpdateStockReadersHandler(Handler[UpdateStockReaders, None]):
    command = UpdateStockReaders

    def __init__(self, readers: ReaderQuery, events: EventLog, repository: Repository) -> None:
        self.readers, self.events, self.repository = readers, events, repository

    def handle(self, command: UpdateStockReaders, context: Context) -> None:
        for stock in STOCK_READERS:
            rows = self.readers.with_name(stock.name).limited(1)
            if not rows:
                self.repository.save(self.reader(stock), context)
                continue
            reader = rows[0]
            if reader.creator_id != CORE_ACTOR_ID or self.was_edited(reader):
                continue
            updated = self.reader(stock, reader)
            if updated != reader:
                self.repository.save(updated, context)

    def was_edited(self, reader: Reader) -> bool:
        fields = {"type", "commands", "lines_pattern", "script", "progress_pattern", "finished_pattern", "failed_pattern", "summary_pattern", "topic_pattern", "title", "subject", "step_pattern", "count_pattern", "count_command"}
        return any(event.event == "reader.update" and event.actor_id != CORE_ACTOR_ID and bool(fields.intersection(event.data))
                   for event in self.events.row_events("readers", reader.id))

    @staticmethod
    def reader(stock: StockReader, reader: Reader | None = None) -> Reader:
        if reader is None:
            reader = Reader(creator_id=CORE_ACTOR_ID, name=stock.name, type=ReaderType.PATTERN, commands=stock.commands)
        return replace(reader, type=ReaderType.PATTERN, commands=stock.commands, lines_pattern=stock.lines, script="",
                       progress_pattern=stock.progress, finished_pattern=stock.finished, failed_pattern=stock.failed,
                       summary_pattern=stock.summary, topic_pattern="", title=stock.title, subject="", step_pattern=stock.step,
                       count_pattern=stock.count, count_command=stock.count_command)

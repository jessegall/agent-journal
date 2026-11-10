from collections.abc import Callable
from dataclasses import replace

from engine.actor.actor import CORE_ACTOR_ID
from core.base.change.event_log import EventLog
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.database.kept_rows import KeptRows
from core.base.repository.repository import Repository
from core.modules.processes.commands.update_stock_readers.update_stock_readers import UpdateStockReaders
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.stock_reader import STOCK_READERS, StockReader
from core.modules.processes.support.stock_reader_rows import StockReaderRows

READER_FIELDS = {"type", "commands", "lines_pattern", "script", "progress_pattern", "finished_pattern", "failed_pattern", "summary_pattern", "topic_pattern", "title", "subject", "step_pattern", "count_pattern", "count_command"}


class UpdateStockReadersHandler(Handler[UpdateStockReaders, None]):
    command = UpdateStockReaders

    def __init__(self, readers: ReaderQuery, events: EventLog, repository: Repository, kept: KeptRows) -> None:
        self.readers, self.events, self.repository, self.kept = readers, events, repository, kept

    def handle(self, command: UpdateStockReaders, context: Context) -> None:
        rows = self.kept.read("readers", self.loaded_rows, name="processes.stock_readers")
        for stock in STOCK_READERS:
            reader = rows.readers.get(stock.name)
            if reader is not None and (reader.creator_id != CORE_ACTOR_ID or reader.id in rows.edited_ids):
                continue
            updated = self.reader(stock, reader)
            if updated != reader:
                saved = self.repository.save_change(reader, updated, context)
                self.kept.update("readers", self.with_saved(saved), name="processes.stock_readers")

    @staticmethod
    def with_saved(saved: Reader) -> Callable[[StockReaderRows], StockReaderRows]:
        def updated(rows: StockReaderRows) -> StockReaderRows:
            return rows.saved(saved)

        return updated

    def loaded_rows(self) -> StockReaderRows:
        readers = {reader.name: reader for reader in self.readers.all_rows()}
        edited = frozenset(event.row_id for event in self.events.row_events_many("readers", [reader.id for reader in readers.values()])
                           if event.event == "reader.update" and event.actor_id != CORE_ACTOR_ID and bool(READER_FIELDS.intersection(event.data)))
        return StockReaderRows(readers, edited)

    @staticmethod
    def reader(stock: StockReader, reader: Reader | None = None) -> Reader:
        if reader is None:
            reader = Reader(creator_id=CORE_ACTOR_ID, name=stock.name, type=ReaderType.PATTERN, commands=stock.commands)
        return replace(reader, type=ReaderType.PATTERN, commands=stock.commands, lines_pattern=stock.lines, script="",
                       progress_pattern=stock.progress, finished_pattern=stock.finished, failed_pattern=stock.failed,
                       summary_pattern=stock.summary, topic_pattern="", title=stock.title, subject="", step_pattern=stock.step,
                       count_pattern=stock.count, count_command=stock.count_command)

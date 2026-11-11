from collections.abc import Callable

from engine.actor.actor import CORE_ACTOR_ID
from engine.command.context import Context
from engine.command.handler import Handler
from engine.database.kept_rows import KeptRows
from engine.repository.repository import Repository
from core.modules.processes.commands.update_stock_readers.update_stock_readers import UpdateStockReaders
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.stock_reader import STOCK_READERS
from core.modules.processes.support.stock_reader_rows import StockReaderRows
from core.modules.processes.support.reading.stock_reader_edits import StockReaderEdits


class UpdateStockReadersHandler(Handler[UpdateStockReaders, None]):
    command = UpdateStockReaders

    def __init__(self, readers: ReaderQuery, edits: StockReaderEdits, repository: Repository, kept: KeptRows) -> None:
        self.readers, self.edits, self.repository, self.kept = readers, edits, repository, kept

    def handle(self, command: UpdateStockReaders, context: Context) -> None:
        rows = self.kept.read("readers", self.loaded_rows, name="processes.stock_readers")
        for stock in STOCK_READERS:
            reader = rows.readers.get(stock.name)
            if reader is not None and (reader.creator_id != CORE_ACTOR_ID or reader.id in rows.edited_ids):
                continue
            updated = stock.applied(reader)
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
        return StockReaderRows(readers, self.edits.edited_ids(readers.values()))

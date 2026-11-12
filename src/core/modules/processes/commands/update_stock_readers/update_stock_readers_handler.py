from collections.abc import Callable
from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.database.kept_rows import KeptRows
from engine.repository.repository import Repository
from core.modules.processes.commands.update_stock_readers.update_stock_readers import UpdateStockReaders
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.stock_reader import STOCK_READERS
from core.modules.processes.support.stock_reader_rows import StockReaderRows
from core.modules.processes.support.stock_digest import StockDigest
from core.modules.processes.support.stock_retirement import StockRetirement
from core.modules.processes.support.reading.stock_reader_edits import StockReaderEdits


class UpdateStockReadersHandler(Handler[UpdateStockReaders, None]):
    command = UpdateStockReaders

    def __init__(self, readers: ReaderQuery, edits: StockReaderEdits, repository: Repository, kept: KeptRows, outputs: OutputQuery, requests: ReaderRequestQuery) -> None:
        self.readers, self.edits, self.repository, self.kept = readers, edits, repository, kept
        self.outputs, self.requests = outputs, requests

    def handle(self, command: UpdateStockReaders, context: Context) -> None:
        rows = self.kept.read(self.readers, self.loaded_rows, name="processes.stock_readers")
        for stock in STOCK_READERS:
            reader = rows.readers.get(stock.name)
            if reader is not None and (not reader.is_stock or reader.id in rows.edited_ids):
                continue
            updated = replace(stock.applied(reader), shipped_digest=StockDigest.of(stock))
            if updated != reader:
                saved = self.repository.save_change(reader, updated, context)
                self.kept.update(self.readers, self.with_saved(saved), name="processes.stock_readers")
        shipped_names = {stock.name for stock in STOCK_READERS}
        for reader in tuple(rows.readers.values()):
            if StockRetirement.retires(reader, shipped_names, reader.id in rows.edited_ids):
                self.retired(reader, context)

    def retired(self, reader: Reader, context: Context) -> None:
        """A stock row whose shipped entry is gone leaves, and the outputs and ended requests it read lose it."""
        for output in tuple(self.outputs.filter(reader_id=reader.id).all_rows()):
            self.repository.update(output, context, reader_id=None)
        for request in tuple(self.requests.filter(reader_id=reader.id).all_rows()):
            self.repository.update(request, context, reader_id=None)
        self.repository.delete(reader, context)

    @staticmethod
    def with_saved(saved: Reader) -> Callable[[StockReaderRows], StockReaderRows]:
        def updated(rows: StockReaderRows) -> StockReaderRows:
            return rows.saved(saved)

        return updated

    def loaded_rows(self) -> StockReaderRows:
        readers = {reader.name: reader for reader in self.readers.all_rows()}
        return StockReaderRows(readers, self.edits.edited_ids(readers.values()))

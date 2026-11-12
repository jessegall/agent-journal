from engine.database.kept_rows import KeptRows
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.reading.reader_layers import ReaderLayers
from core.modules.processes.support.reading.stock_reader_edits import StockReaderEdits

CATALOGUE_REASON = "A command is matched against every reader's patterns, and the readers are a catalogue of shipped and saved readers."


class ReaderRows:
    """Shares the reader catalogue, and the order of its layers, until a reader changes."""

    def __init__(self, readers: ReaderQuery, kept: KeptRows, edits: StockReaderEdits) -> None:
        self.readers, self.kept, self.edits = readers, kept, edits

    def all(self) -> tuple[Reader, ...]:
        return self.kept.read(self.readers, lambda: tuple(self.readers.full_table(CATALOGUE_REASON).all_rows()), name="processes.readers")

    def layers(self) -> ReaderLayers:
        return self.kept.read(self.readers, lambda: ReaderLayers(self.edits.edited_ids(self.all())), name="processes.reader_layers")

    def save(self, reader: Reader) -> None:
        def with_reader(rows: tuple[Reader, ...]) -> tuple[Reader, ...]:
            return tuple(({row.id: row for row in rows} | {reader.id: reader}).values())

        self.kept.update(self.readers, with_reader, name="processes.readers")

    def remove(self, reader: Reader) -> None:
        def without_reader(rows: tuple[Reader, ...]) -> tuple[Reader, ...]:
            return tuple(row for row in rows if row.id != reader.id)

        self.kept.update(self.readers, without_reader, name="processes.readers")

from core.base.database.kept_rows import KeptRows
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery


class ReaderRows:
    """Shares the reader catalogue until a reader changes."""

    def __init__(self, readers: ReaderQuery, kept: KeptRows) -> None:
        self.readers, self.kept = readers, kept

    def all(self) -> tuple[Reader, ...]:
        return self.kept.read("readers", lambda: tuple(self.readers.all_rows()), name="processes.readers")

    def save(self, reader: Reader) -> None:
        def with_reader(rows: tuple[Reader, ...]) -> tuple[Reader, ...]:
            return tuple(({row.id: row for row in rows} | {reader.id: reader}).values())

        self.kept.update("readers", with_reader, name="processes.readers")

    def remove(self, reader: Reader) -> None:
        def without_reader(rows: tuple[Reader, ...]) -> tuple[Reader, ...]:
            return tuple(row for row in rows if row.id != reader.id)

        self.kept.update("readers", without_reader, name="processes.readers")

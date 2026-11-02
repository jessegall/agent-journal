from core.base.refusal import Refusal
from core.modules.processes.queries.reader_query import ReaderQuery


class AliasReaders:
    """The reader an alias names, found by its name: refused when it does not exist, or none for a plugin's
    alias."""

    def __init__(self, readers: ReaderQuery) -> None:
        self.readers = readers

    def existing_reader_id(self, name: str) -> int | None:
        rows = self.readers.with_name(name).page(1, 1).rows if name else ()
        return rows[0].id if rows else None

    def reader_id(self, name: str | None) -> int | None:
        if name is None:
            return None
        rows = self.readers.with_name(name).page(1, 1).rows
        if not rows:
            raise Refusal(f"no reader is called {name}: journal reader list lists them")
        return rows[0].id

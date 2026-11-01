from core.base.refusal import Refusal
from core.modules.processes.queries.reader_query import ReaderQuery


class AliasReaders:
    """The reader an alias names, found by its name."""

    def __init__(self, readers: ReaderQuery) -> None:
        self.readers = readers

    def reader_id(self, name: str | None) -> int | None:
        if name is None:
            return None
        rows = self.readers.with_name(name).page(1, 1).rows
        if not rows:
            raise Refusal(f"no reader is called {name}: journal reader list lists them")
        return rows[0].id

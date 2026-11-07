from core.base.refusal import Refusal
from core.modules.processes.queries.reader_query import ReaderQuery


class AliasReaders:
    """The reader an alias names, found by its name: refused when it does not exist, or none for a plugin's
    alias."""

    def __init__(self, readers: ReaderQuery) -> None:
        self.readers = readers

    def existing_reader_id(self, name: str) -> int | None:
        reader = self.readers.with_name(name).first() if name else None
        return reader.id if reader is not None else None

    def reader_id(self, name: str | None) -> int | None:
        if name is None:
            return None
        reader = self.readers.with_name(name).first()
        if reader is None:
            raise Refusal(f"no reader is called {name}: journal reader list lists them")
        return reader.id

from typing import Generic, TypeVar

from journal.db.connection import Connection
from journal.features.bus import Bus
from journal.models.model import Model

M = TypeVar("M", bound=Model)


class Repository(Generic[M]):
    """Reads and writes one model's table, and tells the bus at each step: saving, creating or updating, created or updated, saved; deleting, deleted."""

    model: type[M]

    def __init__(self, connection: Connection, bus: Bus) -> None: ...

    def find(self, id: int) -> M: ...

    def all(self) -> list[M]: ...

    def where(self, **fields) -> list[M]: ...

    def save(self, row: M) -> M: ...

    def delete(self, row: M) -> None: ...

    def _insert(self, row: M) -> M: ...

    def _update(self, row: M) -> M: ...

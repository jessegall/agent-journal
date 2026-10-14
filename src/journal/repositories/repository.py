from typing import Generic, TypeVar

from journal.db.connection import Connection
from journal.features.bus import Bus
from journal.models.actor import Actor
from journal.models.model import Model

M = TypeVar("M", bound=Model)


class Repository(Generic[M]):
    """Reads and writes one model's table. Every write names its actor, stamps the row with it, and tells the bus at each step: saving, creating or updating, created or updated, saved; deleting, deleted."""

    model: type[M]

    def __init__(self, connection: Connection, bus: Bus) -> None: ...

    def find(self, id: int) -> M: ...

    def all(self) -> list[M]: ...

    def where(self, **fields) -> list[M]: ...

    def save(self, row: M, by: Actor) -> M: ...

    def delete(self, row: M, by: Actor) -> None: ...

    def _insert(self, row: M, by: Actor) -> M: ...

    def _update(self, row: M, by: Actor) -> M: ...

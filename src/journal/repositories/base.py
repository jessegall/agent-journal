from typing import Generic, TypeVar

from journal.db.connection import Connection
from journal.models.base import Model, Scoped

M = TypeVar("M", bound=Model)
S = TypeVar("S", bound=Scoped)


class Repository(Generic[M]):
    """Reads and writes one model's table."""

    model: type[M]

    def __init__(self, connection: Connection) -> None: ...

    def find(self, id: int) -> M: ...

    def all(self) -> list[M]: ...

    def where(self, **fields) -> list[M]: ...

    def save(self, row: M) -> M: ...

    def delete(self, row: M) -> None: ...


class ScopedRepository(Repository[S]):
    """The same, within one environment."""

    def in_(self, environment_id: int) -> list[S]: ...

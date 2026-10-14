from typing import TypeVar

from journal.models.scoped import Scoped
from journal.repositories.repository import Repository

S = TypeVar("S", bound=Scoped)


class ScopedRepository(Repository[S]):
    """The same, within one environment."""

    def in_(self, environment_id: int) -> list[S]: ...

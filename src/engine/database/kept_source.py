from typing import Protocol

from engine.database.kept_select import KeptSelect


class KeptSource(Protocol):
    """A read whose rows a kept value follows: a query of the query layer answers it."""

    def kept_select(self) -> KeptSelect: ...

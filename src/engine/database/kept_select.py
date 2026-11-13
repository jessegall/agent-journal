from typing import Protocol
from engine.database.statement import Statement


class KeptSelect(Protocol):
    """What a kept read needs of a select: whether it reads nothing, and the statements that sign its rows."""

    @property
    def is_empty(self) -> bool: ...

    def signature_statement(self) -> Statement: ...

    def newest_signature_statement(self) -> Statement: ...

    def conditions_statement(self) -> Statement: ...

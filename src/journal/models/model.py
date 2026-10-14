from dataclasses import dataclass
from datetime import datetime

from journal.models.actor import Actor


@dataclass(frozen=True)
class Model:
    """A row. Data only; it never touches the database. Every row says who made it and who last changed it."""

    id: int | None = None
    created_at: datetime | None = None
    created_by: Actor | None = None
    updated_at: datetime | None = None
    updated_by: Actor | None = None

    @classmethod
    def table(cls) -> str: ...

    def with_(self, **changes) -> "Model": ...

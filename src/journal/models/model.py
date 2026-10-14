from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Model:
    """A row. Data only; it never touches the database."""

    id: int | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    @classmethod
    def table(cls) -> str: ...

    def with_(self, **changes) -> "Model": ...

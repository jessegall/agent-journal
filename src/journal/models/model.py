import re
from dataclasses import dataclass, replace
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
    def table(cls) -> str:
        """The class in snake_case, plural: Task is tasks, TaskLog is task_logs, Entry is entries."""
        singular = re.sub(r"(?<!^)(?=[A-Z])", "_", cls.__name__).lower()
        if singular.endswith("y") and singular[-2] not in "aeiou":
            return singular[:-1] + "ies"
        return singular + "s"

    @property
    def is_new(self) -> bool:
        return self.id is None

    def with_(self, **changes) -> "Model":
        return replace(self, **changes)

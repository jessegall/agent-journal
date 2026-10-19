import re
from dataclasses import dataclass, replace
from datetime import datetime
from typing import ClassVar

from journal.models.actor import Actor


@dataclass(frozen=True)
class Model:
    """A row. Data only; it never touches the database. Every row says who made it and who last changed it."""

    text_fields: ClassVar[tuple[str, ...]] = ()
    """The fields that hold the row's own words: what it is searched by and may name other rows in."""
    handed_to_agent: ClassVar[bool] = False
    """A row the user makes for the agent to work through, such as a dump: a sequence that starts on one starts for the live agent."""

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

    @classmethod
    def noun(cls) -> str:
        """The class in plain words: Task is task, TaskLog is task log."""
        return re.sub(r"(?<!^)(?=[A-Z])", " ", cls.__name__).lower()

    @property
    def is_new(self) -> bool:
        return self.id is None

    def mentioning_text(self) -> str:
        """The row's own text, in which it may name other rows, such as task 12 or plan 3; empty for a row with no text of its own."""
        return "\n".join(str(getattr(self, name)) for name in self.text_fields)

    def with_(self, **changes) -> "Model":
        return replace(self, **changes)

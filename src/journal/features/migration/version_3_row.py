import json
import re
from dataclasses import dataclass, field
from datetime import datetime, timezone

SECTION = re.compile(r"^## ", re.M)


@dataclass(frozen=True)
class Version3Row:
    """One version 3 row as its file holds it: a JSON header between two --- lines, then its brief, then its ## sections."""

    kind: str
    n: int
    title: str = ""
    abstract: str = ""
    refs: tuple[str, ...] = ()
    seen: tuple[str, ...] = ()
    created: float = 0.0
    updated: float = 0.0
    deleted: float = 0.0
    completed: float = 0.0
    outcome: str = ""
    data: dict = field(default_factory=dict)
    brief: str = ""
    sections: tuple[tuple[str, str], ...] = ()

    @classmethod
    def from_text(cls, text: str) -> "Version3Row":
        _, header, rest = text.split("---\n", 2)
        head = json.loads(header)
        brief, *parts = SECTION.split(rest)
        sections = tuple(tuple(part.split("\n", 1)) if "\n" in part else (part, "") for part in parts)
        return cls(head["type"], int(head["n"]), head.get("title", ""), head.get("abstract", ""), tuple(head.get("refs", ())), tuple(head.get("seen", ())),
                   float(head.get("created", 0)), float(head.get("updated", 0)), float(head.get("deleted", 0)), float(head.get("completed", 0)),
                   head.get("outcome", ""), head.get("data", {}), brief.strip(), tuple((title.strip(), body.strip()) for title, body in sections))

    def markdown(self) -> str:
        """Its brief and its sections as one markdown text, each section under its ## heading."""
        return "\n\n".join([self.brief, *(f"## {title}\n\n{body}" for title, body in self.sections)]).strip()

    def listed(self, key: str) -> list:
        """A list the row's data holds, such as a plan's phases or a question's options; a row written without one has none."""
        if key not in self.data:
            return []
        return list(self.data[key])

    def made_at(self) -> datetime:
        return datetime.fromtimestamp(self.created, timezone.utc)

    def closed_at(self) -> datetime | None:
        """When it was completed: read, answered, done or struck; none while it is open."""
        return datetime.fromtimestamp(self.completed, timezone.utc) if self.completed else None

    def read_at(self) -> datetime | None:
        """When the other side read it: its completion, or, for a row seen by more than its author, its last change."""
        if self.completed:
            return self.closed_at()
        return datetime.fromtimestamp(self.updated, timezone.utc) if len(self.seen) > 1 else None

    def author(self) -> str:
        """Who made it: user, agent or system."""
        return self.seen[0]

    def is_open(self) -> bool:
        return not self.completed and not self.deleted

    def is_deleted(self) -> bool:
        return bool(self.deleted)

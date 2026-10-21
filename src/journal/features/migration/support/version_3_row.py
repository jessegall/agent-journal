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
    viewed: tuple[str, ...] = ()
    created: float = 0.0
    updated: float = 0.0
    deleted: float = 0.0
    completed: float = 0.0
    outcome: str = ""
    data: dict = field(default_factory=dict)
    brief: str = ""
    sections: tuple[tuple[str, str], ...] = ()

    @classmethod
    def parsed(cls, text: str) -> "Version3Row":
        _, header, remainder = text.split("---\n", 2)
        head = json.loads(header)
        brief, *parts = SECTION.split(remainder)
        sections = tuple(tuple(part.split("\n", 1)) if "\n" in part else (part, "") for part in parts)
        return cls(head["type"], int(head["n"]), head.get("title", ""), head.get("abstract", ""), tuple(head.get("refs", ())), tuple(head.get("seen", ())),
                   float(head.get("created", 0)), float(head.get("updated", 0)), float(head.get("deleted", 0)), float(head.get("completed", 0)),
                   head.get("outcome", ""), head.get("data", {}), brief.strip(), tuple((title.strip(), body.strip()) for title, body in sections))

    def markdown(self) -> str:
        return "\n\n".join([self.brief, *(f"## {title}\n\n{body}" for title, body in self.sections)]).strip()

    def listed(self, key: str) -> list:
        if key not in self.data:
            return []
        return list(self.data[key])

    def creation_moment(self) -> datetime:
        return datetime.fromtimestamp(self.created, timezone.utc)

    def closing_moment(self) -> datetime | None:
        return datetime.fromtimestamp(self.completed, timezone.utc) if self.completed else None

    def reading_moment(self) -> datetime | None:
        if self.completed:
            return self.closing_moment()
        return datetime.fromtimestamp(self.updated, timezone.utc) if len(self.viewed) > 1 else None

    def author(self) -> str:
        return self.viewed[0]

    def is_open(self) -> bool:
        return not self.completed and not self.deleted

    def is_deleted(self) -> bool:
        return bool(self.deleted)

from dataclasses import dataclass, field
from datetime import datetime

from journal.models.actor import Actor
from journal.models.model import Model
from journal.models.ref import Ref

USER, AGENT, SYSTEM = "user", "agent", "system"


def seconds(at: datetime | None) -> float:
    return at.timestamp() if at else 0.0


VIEWER_TYPES = {"tasks": "todo", "docs": "doc", "plans": "plan", "reports": "report", "questions": "question", "facts": "fact", "rules": "rule", "reminders": "reminder", "messages": "message"}


def viewer_ref(ref: Ref) -> str:
    """A link's end as the viewer names rows: tasks:12 is todo:12."""
    return f"{VIEWER_TYPES.get(ref.type, ref.type.rstrip('s'))}:{ref.id}"


def who(actor: Actor | None) -> str:
    return actor.kind.value if actor else SYSTEM


@dataclass
class V3Row:
    """A row as version 3's viewer reads it: what every type carries, filled by its shaper from a version 4 model."""

    type: str
    n: int
    title: str = ""
    abstract: str = ""
    brief: str = ""
    sections: list = field(default_factory=list)
    refs: list = field(default_factory=list)
    seen: list = field(default_factory=list)
    data: dict = field(default_factory=dict)
    created: float = 0.0
    updated: float = 0.0
    deleted: float = 0.0
    completed: float = 0.0
    outcome: str = ""
    state: str = ""

    @classmethod
    def of(cls, type: str, model: Model, **fields) -> "V3Row":
        base = dict(type=type, n=model.id, created=seconds(model.created_at), updated=seconds(model.updated_at) or seconds(model.created_at), seen=[who(model.created_by)])
        return cls(**{**base, **fields})

    @property
    def ref(self) -> str:
        return f"{self.type}:{self.n}"

    def to_json(self) -> dict:
        return {**vars(self), "ref": self.ref}

    @property
    def is_open(self) -> bool:
        return not self.completed and not self.deleted

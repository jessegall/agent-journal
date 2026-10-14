from dataclasses import dataclass, field
from datetime import datetime

from journal.models.actor import Actor
from journal.models.model import Model

USER, AGENT, SYSTEM = "user", "agent", "system"


def seconds(at: datetime | None) -> float:
    return at.timestamp() if at else 0.0


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

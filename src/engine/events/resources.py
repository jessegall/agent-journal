from dataclasses import dataclass, replace
from typing import ClassVar

from engine.events.base import AgentEvent, TypedEvent

WRITTEN = ("created", "updated")


@dataclass(frozen=True)
class RowAction(TypedEvent):
    action: str = ""

    @property
    def written(self) -> bool:
        return self.action in WRITTEN


@dataclass(frozen=True)
class ResourceEvent(RowAction):
    n: int = 0
    type: str = ""
    actor: str = ""

    @classmethod
    def read(cls, event) -> "ResourceEvent":
        return replace(cls.from_json(event.data), n=event.n, action=event.action, type=event.type, actor=event.actor)


@dataclass(frozen=True)
class AnyEvent(ResourceEvent):
    on: ClassVar[str] = "*"


@dataclass(frozen=True)
class ResourceCreated(ResourceEvent):
    on: ClassVar[str] = "created"


@dataclass(frozen=True)
class MessageCreated(ResourceEvent):
    on: ClassVar[str] = "message.created"


@dataclass(frozen=True)
class RuleCreated(ResourceEvent):
    on: ClassVar[str] = "rule.created"


@dataclass(frozen=True)
class CommentCreated(ResourceEvent):
    on: ClassVar[str] = "comment.created"


@dataclass(frozen=True)
class WorkCreated(ResourceEvent):
    on: ClassVar[str] = "work.created"


@dataclass(frozen=True)
class MessageUpdated(ResourceEvent):
    on: ClassVar[str] = "message.updated"
    numbers: tuple = ()
    file: str = ""

    @classmethod
    def read(cls, event) -> "MessageUpdated":
        return replace(super().read(event), numbers=tuple(event.data.get("numbers") or [event.n]))


@dataclass(frozen=True)
class QuestionAnswered(ResourceEvent):
    on: ClassVar[str] = "question.completed"


@dataclass(frozen=True)
class TodoCompleted(ResourceEvent):
    on: ClassVar[str] = "todo.completed"


@dataclass(frozen=True)
class AgentChanged(AgentEvent, RowAction):
    on: ClassVar[str] = "agent"

    @classmethod
    def read(cls, event) -> "AgentChanged":
        return cls(agent=event.n, action=event.action)

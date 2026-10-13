"""The moments of the template resource type, and the facts the templates feature recognises: a row made from a template, and work whose row follows one."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent


@dataclass(frozen=True)
class TemplateCreated(ResourceEvent):
    on: ClassVar[str] = "template.created"


@dataclass(frozen=True)
class TemplateUpdated(ResourceEvent):
    on: ClassVar[str] = "template.updated"


@dataclass(frozen=True)
class TemplateCompleted(ResourceEvent):
    on: ClassVar[str] = "template.completed"


@dataclass(frozen=True, kw_only=True)
class TemplateChosen(Fact):
    """A row made from a template, which starts with the template's parts, filled in, and links the template."""

    type: str
    n: int
    ref: str
    sections: tuple[tuple[str, str], ...]


@dataclass(frozen=True, kw_only=True)
class TemplateToRead(Fact):
    """The agent is to read the instructions of the template the work it is on follows."""

    agent: int
    n: int
    title: str
    brief: str

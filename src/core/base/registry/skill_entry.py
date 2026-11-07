from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from functools import cached_property
from typing import Any

from core.base.change.event_pattern import EventPattern


@dataclass(frozen=True)
class SkillEntry:
    """A registered skill: its folder and the module that declares it, its description, keywords, command
    nouns and event patterns, the digest of its text, the file the text is in, and whether the journal ships
    its module."""

    folder: str
    module: str
    description: str
    keywords: Sequence[str]
    commands: Sequence[str]
    events: Sequence[str]
    digest: str
    path: str
    shipped: bool
    modified_at: int | None = None

    @cached_property
    def event_patterns(self) -> tuple[EventPattern, ...]:
        return tuple(EventPattern(pattern) for pattern in self.events)

    def covers_event(self, event: str) -> bool:
        return any(pattern.matches(event) for pattern in self.event_patterns)

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "SkillEntry":
        return cls(stored["folder"], stored["module"], stored["description"], tuple(stored["keywords"]), tuple(stored["commands"]), tuple(stored["events"]),
                   stored["digest"], stored["path"], stored["shipped"])

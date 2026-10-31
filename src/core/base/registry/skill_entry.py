from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class SkillEntry:
    """A registered skill: its folder and the module that declares it, its description, keywords, command nouns
    and event patterns, the digest of its text, the file the text is in, and whether the journal ships its module."""

    folder: str
    module: str
    description: str
    keywords: Sequence[str]
    commands: Sequence[str]
    events: Sequence[str]
    digest: str
    path: str
    shipped: bool

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "SkillEntry":
        return cls(stored["folder"], stored["module"], stored["description"], tuple(stored["keywords"]), tuple(stored["commands"]), tuple(stored["events"]),
                   stored["digest"], stored["path"], stored["shipped"])

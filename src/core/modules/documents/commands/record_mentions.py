from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordMentions(Command[int]):
    """Links a row to every existing row its text names in words, once each."""

    source: str
    text: str

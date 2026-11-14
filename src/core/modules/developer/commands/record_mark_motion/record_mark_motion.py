from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordMarkMotion(Command[None]):
    """Keeps the recordings the viewer made of chat marks opening or closing, given as one JSON array, a line each."""

    lock = False

    recordings: str

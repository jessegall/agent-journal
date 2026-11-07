from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordMarkMotion(Command[None]):
    """Keeps the frames the viewer sampled while a chat mark opened or closed, as one JSON line."""

    lock = False

    frames: str

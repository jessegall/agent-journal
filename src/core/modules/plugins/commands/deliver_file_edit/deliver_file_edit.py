from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class DeliverFileEdit(Command[None]):
    """Tells every plugin that hears file_edited of a file the file scan found changed."""

    agent_id: int
    path: str
    folder: str
    lines: Sequence[Mapping[str, object]]

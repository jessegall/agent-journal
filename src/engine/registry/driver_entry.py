from collections.abc import Sequence
from dataclasses import dataclass

from engine.dotted_path.dotted_path import DottedPath


@dataclass(frozen=True)
class DriverEntry:
    """A registered suite driver: its full name, its class, the module that ships it, its suite, the agent type
    it drives and the instruction lines its agent starts with."""

    name: str
    path: DottedPath
    module: str
    suite: str
    role: str
    instructions: Sequence[str]

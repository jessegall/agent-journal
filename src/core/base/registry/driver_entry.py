from collections.abc import Sequence
from dataclasses import dataclass

from core.base.registry.dotted_path import DottedPath


@dataclass(frozen=True)
class DriverEntry:
    """A registered driver: its full name, its class, the module that ships it, its suite and role, and the lines it
    opens a session with."""

    name: str
    path: DottedPath
    module: str
    suite: str
    role: str
    opening_lines: Sequence[str]

from dataclasses import dataclass
from collections.abc import Sequence

from engine.helper_type.command_allow_list import CommandAllowList


@dataclass(frozen=True)
class MergerCommands(CommandAllowList):
    """What the merger may run beside a read-only helper's lines: its merger lines and the worker lines it
    settles a worker's work with."""

    groups: Sequence[str] = ("merger",)
    lines: Sequence[str] = ("worker logs", "worker merge", "worker update", "worker ask", "helper grant", "helper run", "proof check", "proof short")

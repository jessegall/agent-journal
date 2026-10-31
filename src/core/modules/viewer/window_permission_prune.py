from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class WindowPermissionPrune(Command[int]):
    """Deletes the permissions of windows and modules no longer installed."""

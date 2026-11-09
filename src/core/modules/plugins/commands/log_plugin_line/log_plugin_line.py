from dataclasses import dataclass

from core.base.command.command import Command
from core.base.log_level import LogLevel


@dataclass(frozen=True)
class LogPluginLine(Command[None]):
    """Writes a line of a plugin to the system log at a level."""

    lock = False

    plugin_name: str
    level: LogLevel
    text: str

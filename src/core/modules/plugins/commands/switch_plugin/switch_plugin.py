from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin import Plugin


@dataclass(frozen=True)
class SwitchPlugin(Command[Plugin]):
    """The person switches a plugin on or off."""

    name: str
    enabled: bool

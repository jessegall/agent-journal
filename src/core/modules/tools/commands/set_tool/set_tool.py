from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.tools.support.tool_card import ToolCard


@dataclass(frozen=True)
class SetTool(Command[ToolCard]):
    """Turns one supported tool on or off."""

    name: str
    enabled: bool

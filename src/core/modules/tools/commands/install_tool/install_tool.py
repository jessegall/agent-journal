from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tools.support.tool_card import ToolCard


@dataclass(frozen=True)
class InstallTool(Command[ToolCard]):
    """Installs one supported tool with its install command."""

    name: str

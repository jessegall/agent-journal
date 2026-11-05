from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.templates.models.template import Template


@dataclass(frozen=True)
class MakeTemplate(Command[Template]):
    """Writes a template from its title and its fields."""

    title: str
    brief: str
    targets: tuple[str, ...]
    purpose: str
    parts: tuple[str, ...]
    commands: tuple[str, ...]

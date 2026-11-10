from dataclasses import dataclass

from engine.command.command import Command
from core.modules.project_rules.models.project_rule import ProjectRule


@dataclass(frozen=True)
class MakeRule(Command[ProjectRule]):
    """Makes a project rule, active from a person and proposed from an agent."""

    lock = False

    text: str

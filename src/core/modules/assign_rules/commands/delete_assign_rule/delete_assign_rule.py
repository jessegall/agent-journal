from dataclasses import dataclass

from engine.command.delete_command import DeleteCommand
from core.modules.assign_rules.models.assign_rule import AssignRule


@dataclass(frozen=True)
class DeleteAssignRule(DeleteCommand):
    """Deletes a rule with its conditions."""

    deleted_model = AssignRule

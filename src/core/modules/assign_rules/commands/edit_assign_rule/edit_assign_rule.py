from dataclasses import dataclass

from engine.command.edit_command import EditCommand
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.enums.rule_target import RuleTarget
from core.modules.assign_rules.support.condition_line import ConditionLine

CONDITIONS_FIELD = "conditions"
REVISION_FIELD = "revision"


@dataclass(frozen=True)
class EditAssignRule(EditCommand[AssignRule]):
    """Changes a rule's target, or replaces all its conditions; a field left as None is not changed. A new
    target clears the agent, program and model the command does not give."""

    target: RuleTarget | None = None
    target_agent_id: int | None = None
    program: str | None = None
    program_model: str | None = None
    queue_limit: int | None = None
    conditions: tuple[ConditionLine, ...] | None = None
    revision: str = ""

    def rule_changes(self) -> dict[str, object]:
        if self.target is None:
            return {name: value for name, value in self.changed_fields().items() if name not in (CONDITIONS_FIELD, REVISION_FIELD)}
        target_fields = {"target": self.target, "target_agent_id": self.target_agent_id, "program": self.program or "", "program_model": self.program_model or ""}
        return target_fields if self.queue_limit is None else {**target_fields, "queue_limit": self.queue_limit}

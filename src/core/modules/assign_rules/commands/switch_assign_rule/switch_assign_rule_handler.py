from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.assign_rules.commands.switch_assign_rule.switch_assign_rule import SwitchAssignRule
from core.modules.assign_rules.models.assign_rule import AssignRule


class SwitchAssignRuleHandler(Handler[SwitchAssignRule, AssignRule]):
    """Turns a rule on or off."""

    command = SwitchAssignRule

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: SwitchAssignRule, context: Context) -> AssignRule:
        return self.repository.update(self.rows.required(AssignRule, command.rule_id), context, enabled=command.enabled)

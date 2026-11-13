from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.assign_rules.commands.switch_assign_rule.switch_assign_rule import SwitchAssignRule
from core.modules.assign_rules.support.rule_revision import RuleRevision
from core.modules.assign_rules.models.assign_rule import AssignRule


class SwitchAssignRuleHandler(Handler[SwitchAssignRule, AssignRule]):
    """Turns a rule on or off; a rule already in that state is refused, so the change is never empty."""

    command = SwitchAssignRule

    def __init__(self, rows: EventRows, repository: Repository, revision: RuleRevision) -> None:
        self.rows, self.repository, self.revision = rows, repository, revision

    def handle(self, command: SwitchAssignRule, context: Context) -> AssignRule:
        self.revision.check(command.revision)
        rule = self.rows.required(AssignRule, command.rule_id)
        if rule.enabled == command.enabled:
            raise Refusal(f"rule {rule.id} is {'on' if rule.enabled else 'off'} already")
        return self.repository.update(rule, context, enabled=command.enabled)

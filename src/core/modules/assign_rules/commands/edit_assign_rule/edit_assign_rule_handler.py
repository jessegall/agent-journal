from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.assign_rules.commands.edit_assign_rule.edit_assign_rule import EditAssignRule
from core.modules.assign_rules.support.rule_revision import RuleRevision
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.rule_conditions import RuleConditions
from core.modules.assign_rules.support.rule_limits import RuleLimits


class EditAssignRuleHandler(Handler[EditAssignRule, AssignRule]):
    """Changes a rule's target and replaces its conditions, within the limit of conditions."""

    command = EditAssignRule

    def __init__(self, rows: EventRows, repository: Repository, conditions: RuleConditions, revision: RuleRevision) -> None:
        self.rows, self.repository, self.conditions, self.revision = rows, repository, conditions, revision

    def handle(self, command: EditAssignRule, context: Context) -> AssignRule:
        self.revision.check(command.revision)
        rule = self.rows.required(AssignRule, command.row_id)
        changes = command.rule_changes()
        if not changes and command.conditions is None:
            raise Refusal(f"nothing to change in rule {rule.id}", "give --target or --condition")
        if command.conditions is not None:
            RuleLimits.check_condition_count(len(command.conditions))
            self.conditions.replace(rule, command.conditions, context)
        return self.repository.update(rule, context, **changes)

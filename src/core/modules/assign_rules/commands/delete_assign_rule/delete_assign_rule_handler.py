from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.assign_rules.commands.delete_assign_rule.delete_assign_rule import DeleteAssignRule
from core.modules.assign_rules.support.rule_revision import RuleRevision
from core.modules.assign_rules.models.assign_rule import ENVIRONMENT_COLUMN, AssignRule
from core.modules.assign_rules.support.rule_conditions import RuleConditions
from core.modules.plans.support.positions import Positions


class DeleteAssignRuleHandler(Handler[DeleteAssignRule, None]):
    """Deletes a rule and its conditions and closes its place in the order; tasks it assigned stay assigned."""

    command = DeleteAssignRule

    def __init__(self, rows: EventRows, repository: Repository, positions: Positions, conditions: RuleConditions, revision: RuleRevision) -> None:
        self.rows, self.repository, self.positions, self.conditions, self.revision = rows, repository, positions, conditions, revision

    def handle(self, command: DeleteAssignRule, context: Context) -> None:
        self.revision.check(command.revision)
        rule = self.rows.required(AssignRule, command.row_id)
        self.conditions.delete(rule, context)
        self.repository.delete_stored(rule, context)
        self.positions.renumber(AssignRule, ENVIRONMENT_COLUMN, rule.environment_id, rule.position, context)

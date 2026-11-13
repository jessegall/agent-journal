from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition
from core.modules.assign_rules.support.condition_line import ConditionLine


class RuleConditions:
    """Reads and writes the conditions of one rule."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def lines(self, rule: AssignRule) -> tuple[ConditionLine, ...]:
        return tuple(ConditionLine.stored(condition) for condition in self.stored(rule))

    def stored(self, rule: AssignRule) -> list[AssignRuleCondition]:
        return self.queries.query(AssignRuleCondition).filter(rule_id=rule.id).ordered("id").get()

    def save(self, rule: AssignRule, lines: tuple[ConditionLine, ...], context: Context) -> None:
        for line in lines:
            self.repository.save(line.row(rule.id), context)

    def replace(self, rule: AssignRule, lines: tuple[ConditionLine, ...], context: Context) -> None:
        self.delete(rule, context)
        self.save(rule, lines, context)

    def delete(self, rule: AssignRule, context: Context) -> None:
        self.repository.delete_many_stored(self.stored(rule), context)

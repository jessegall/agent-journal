from collections.abc import Sequence

from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition
from core.modules.assign_rules.support.condition_line import ConditionLine


CONDITIONS_REASON = "the conditions of every rule asked about are read in one query"


class RuleConditions:
    """Reads and writes the conditions of a rule; the conditions of many rules are read in one query."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def lines(self, rule: AssignRule) -> tuple[ConditionLine, ...]:
        return tuple(ConditionLine.stored(condition) for condition in self.stored(rule))

    def lines_by_rule(self, rules: Sequence[AssignRule]) -> dict[int, tuple[ConditionLine, ...]]:
        lines: dict[int, list[ConditionLine]] = {rule.id: [] for rule in rules}
        for condition in self.queries.query(AssignRuleCondition).where_in("rule_id", list(lines)).ordered("id").every_row(CONDITIONS_REASON):
            lines[condition.rule_id].append(ConditionLine.stored(condition))
        return {rule_id: tuple(rule_lines) for rule_id, rule_lines in lines.items()}

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

import hashlib
from collections.abc import Mapping, Sequence

from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.condition_line import ConditionLine
from core.modules.assign_rules.support.rule_conditions import RuleConditions

RULES_REASON = "the revision covers every rule of the environment"
REVISION_CHARACTERS = 12


class RuleRevision:
    """A short text that changes whenever a rule of the environment or one of its conditions changes, so a
    save made from an older reading of the rules is refused."""

    def __init__(self, queries: Queries, conditions: RuleConditions) -> None:
        self.queries, self.conditions = queries, conditions

    def current(self) -> str:
        rules = list(self.queries.query(AssignRule).every_row(RULES_REASON))
        return self.rules_revision(rules, self.conditions.rule_lines(rules))

    @staticmethod
    def rules_revision(rules: Sequence[AssignRule], lines: Mapping[int, tuple[ConditionLine, ...]]) -> str:
        parts = sorted((rule.id, rule.version, tuple(line.text for line in lines[rule.id])) for rule in rules)
        return hashlib.sha256(repr(parts).encode()).hexdigest()[:REVISION_CHARACTERS]

    def check(self, expected: str) -> None:
        if expected and expected != self.current():
            raise Refusal("the rules changed since this draft was read", "read the rules again and make the change on them")

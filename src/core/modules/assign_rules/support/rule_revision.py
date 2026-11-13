import hashlib

from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition

RULES_REASON = "the revision covers every rule of the environment"
CONDITIONS_REASON = "the revision covers every condition of the environment's rules"


class RuleRevision:
    """A short text that changes whenever a rule of the environment or one of its conditions changes, so a
    save made from an older reading of the rules is refused."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def current(self) -> str:
        rules = sorted((rule.id, rule.version) for rule in self.queries.query(AssignRule).every_row(RULES_REASON))
        conditions = sorted(condition.id for condition in self.queries.query(AssignRuleCondition).where_in("rule_id", [rule_id for rule_id, _ in rules]).every_row(CONDITIONS_REASON))
        return hashlib.sha256(repr((rules, conditions)).encode()).hexdigest()[:12]

    def check(self, expected: str) -> None:
        if expected and expected != self.current():
            raise Refusal("the rules changed since this draft was read", "read the rules again and make the change on them")

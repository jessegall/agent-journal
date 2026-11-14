import hashlib
from collections.abc import Mapping, Sequence

from engine.errors.refusal import Refusal
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.assign_rules import AssignRules
from core.modules.assign_rules.support.condition_line import ConditionLine

REVISION_CHARACTERS = 12


class RuleRevision:
    """A short text that changes whenever a rule of the environment or one of its conditions changes, so a
    save made from an older reading of the rules is refused."""

    def __init__(self, rules: AssignRules) -> None:
        self.rules = rules

    def current(self) -> str:
        environment_rules = self.rules.environment_rules()
        return self.rules_revision(environment_rules.rules, environment_rules.lines)

    @staticmethod
    def rules_revision(rules: Sequence[AssignRule], lines: Mapping[int, tuple[ConditionLine, ...]]) -> str:
        parts = sorted((rule.id, rule.version, tuple(line.text for line in lines[rule.id])) for rule in rules)
        return hashlib.sha256(repr(parts).encode()).hexdigest()[:REVISION_CHARACTERS]

    def check(self, expected: str) -> None:
        if expected and expected != self.current():
            raise Refusal("the rules changed since this draft was read", "read the rules again and make the change on them")

from dataclasses import dataclass

from engine.row.metadata import Metadata

RULES_MODULE = "journal.core.assign_rules"
RULE_KEY = "rule"


@dataclass(frozen=True)
class RuleMark:
    """The rule an assignment names in its metadata, under this module's key, when a rule gave it."""

    rule_id: int

    def values(self) -> dict[str, int]:
        return {RULE_KEY: self.rule_id}

    def marked(self, metadata: Metadata) -> Metadata:
        return Metadata({**metadata.values, RULES_MODULE: self.values()})

    @staticmethod
    def read(metadata: Metadata) -> "RuleMark | None":
        rule_id = metadata.module_part(RULES_MODULE).get(RULE_KEY)
        return RuleMark(rule_id) if isinstance(rule_id, int) else None

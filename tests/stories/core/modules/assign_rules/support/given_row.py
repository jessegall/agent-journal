from collections.abc import Mapping
from dataclasses import dataclass

RULES_MODULE = "journal.core.assign_rules"


@dataclass(frozen=True)
class GivenRow:
    """One assignment of a task, as a story reads it: the task, the actor it went to, the rule that gave it, if
    a rule did, and who made the assignment."""

    task_id: int
    actor_id: int
    rule_id: int | None
    creator_id: int

    @classmethod
    def parsed(cls, row: Mapping[str, object]) -> "GivenRow":
        metadata = row["metadata"]
        rule = metadata.get(RULES_MODULE, {}) if isinstance(metadata, Mapping) else {}
        return cls(int(str(row["subject_id"])), int(str(row["actor_id"])), rule.get("rule") if isinstance(rule, Mapping) else None,
                   int(str(row["creator_id"])))

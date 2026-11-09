from enum import StrEnum


class DecisionOutcome(StrEnum):
    """What the assign rules decided about one task."""

    ASSIGNED = "assigned"
    UNMATCHED = "unmatched"
    SKIPPED = "skipped"
    HAS_ASSIGNEE = "has_assignee"
    PLANNED = "planned"
    FAILED = "failed"
    DRY_RUN = "dry_run"

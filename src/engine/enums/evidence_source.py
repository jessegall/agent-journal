from enum import StrEnum


class EvidenceSource(StrEnum):
    """Where a hold condition reads its evidence: from rows in a step, or from the admitted lifting command."""

    ROWS = "rows"
    ADMITTED_COMMAND = "admitted-command"

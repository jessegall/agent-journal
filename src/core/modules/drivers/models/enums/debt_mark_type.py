from enum import StrEnum


class DebtMarkType(StrEnum):
    """The chat mark of a line the agent chose not to act on."""

    SKIPPED = "drivers.debt-skipped"

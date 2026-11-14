from enum import StrEnum


class RequiredCommandMarkType(StrEnum):
    """The chat mark of a line the agent chose not to act on."""

    SKIPPED = "drivers.required_command-skipped"

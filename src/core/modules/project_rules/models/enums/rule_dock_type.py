from enum import StrEnum


class RuleDockType(StrEnum):
    """Where a rule docks above the chat: a rule an agent proposed, waiting for a user."""

    PROPOSED = "project-rules.proposed"

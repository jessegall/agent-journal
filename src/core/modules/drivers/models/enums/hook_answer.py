from enum import StrEnum


class HookAnswer(StrEnum):
    """How the journal answered a hook: it allowed it, or refused it."""

    ALLOWED = "allowed"
    REFUSED = "refused"

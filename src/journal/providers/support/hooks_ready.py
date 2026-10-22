from enum import StrEnum


class HooksReady(StrEnum):
    """Whether the program will run the journal's hooks in a project: they are ready, absent from its settings, never trusted, or trusted before the journal changed them."""

    READY = "ready"
    UNWIRED = "unwired"
    UNTRUSTED = "untrusted"
    TRUST_OUTDATED = "trust outdated"

    def needs_trust(self) -> bool:
        return self in (HooksReady.UNTRUSTED, HooksReady.TRUST_OUTDATED)

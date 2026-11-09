from core.base.refusal import Refusal


class LocalJournalRefusal(Refusal):
    """A local journal was asked for the choices of a hosted one."""

    @classmethod
    def has_no_mode(cls) -> "LocalJournalRefusal":
        return cls("this journal is local, so it has no hosted mode", "ask is_hosted before reading mode")

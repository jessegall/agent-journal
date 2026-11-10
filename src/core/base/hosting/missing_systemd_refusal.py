from engine.errors.refusal import Refusal


class MissingSystemdRefusal(Refusal):
    """A hosted journal was started on a host that does not run systemd."""

    @classmethod
    def no_systemd(cls) -> "MissingSystemdRefusal":
        return cls("a hosted journal needs systemd, and /run/systemd/system is missing", "start the journal from a systemd unit")

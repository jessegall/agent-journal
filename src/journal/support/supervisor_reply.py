from dataclasses import dataclass


@dataclass(frozen=True)
class SupervisorReply:
    """What a supervisor answered a request: whether it did it, and why not."""

    ok: bool
    error: str = ""

    @classmethod
    def parsed(cls, data: dict) -> "SupervisorReply":
        return cls(bool(data.get("ok")), str(data.get("error", "")))

from dataclasses import dataclass


@dataclass(frozen=True)
class SupervisorReply:
    """What a supervisor answered a request: whether it did it, why not, and to hello whether its code on disk changed since it started."""

    success: bool
    error: str = ""
    outdated: bool = False

    @classmethod
    def parsed(cls, data: dict) -> "SupervisorReply":
        return cls(bool(data.get("ok")), str(data.get("error", "")), bool(data.get("outdated")))

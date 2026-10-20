from dataclasses import dataclass


@dataclass(frozen=True)
class Decision:
    """What the hook script tells the agent back: go on, stop, or go on and read this."""

    allowed: bool = True
    reason: str = ""
    context: str = ""

    @classmethod
    def refuse(cls, reason: str) -> "Decision":
        return cls(False, reason)

    @classmethod
    def allowed_with(cls, context: str) -> "Decision":
        return cls(True, "", context)

    def merged(self, other: "Decision") -> "Decision":
        return Decision(self.allowed and other.allowed, "\n".join(r for r in (self.reason, other.reason) if r), "\n".join(c for c in (self.context, other.context) if c))


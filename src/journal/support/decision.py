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

    def merged(self, counterpart: "Decision") -> "Decision":
        return Decision(self.allowed and counterpart.allowed, "\n".join(r for r in (self.reason, counterpart.reason) if r), "\n".join(c for c in (self.context, counterpart.context) if c))


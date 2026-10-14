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
    def tell(cls, context: str) -> "Decision":
        return cls(True, "", context)

    def merged(self, other: "Decision") -> "Decision":
        return Decision(self.allowed and other.allowed, "\n".join(r for r in (self.reason, other.reason) if r), "\n".join(c for c in (self.context, other.context) if c))

    @property
    def status(self) -> int:
        """200 to go on, 409 when refused; the hook script turns it into the agent's exit code."""
        return 200 if self.allowed else 409

    def as_hook_output(self) -> dict:
        if not self.allowed:
            return {"error": self.reason}
        return {"additionalContext": self.context} if self.context else {}

from dataclasses import dataclass


@dataclass(frozen=True)
class Moment:
    """A point counted in every unit a timeout waits in: seconds, the agent's tool uses, its edits and its context marks."""

    seconds: float = 0.0
    tool_uses: int = 0
    edits: int = 0
    context_thresholds: int = 0

    def value(self, unit: str) -> float:
        return {"seconds": self.seconds, "tool_uses": self.tool_uses, "edits": self.edits, "context_thresholds": self.context_thresholds}[unit]

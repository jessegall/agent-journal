from dataclasses import dataclass


@dataclass(frozen=True)
class StopCheck:
    rule: str
    outcome: str
    reason: str
    applied: bool
    layer: str | None = None

    @property
    def is_refusal(self) -> bool:
        return self.outcome == "refused"

    @property
    def refusal_text(self) -> str:
        return f"{self.rule} ({self.reason})"

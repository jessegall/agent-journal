from dataclasses import asdict, dataclass, fields, replace


@dataclass(frozen=True)
class SequenceRun:
    """A sequence an agent is working through: the steps as they were when it started, the step in hand, the row it is about, when it started, when the step was taken up, when the step was last said, why it is parked when it is, and the states its row must reach before it may end."""

    sequence_id: int
    title: str
    steps: tuple[str, ...]
    step: int = 0
    subject: str = ""
    started_at: str = ""
    adopted_at: str = ""
    announced_at: str = ""
    suspension_reason: str = ""
    end_condition: tuple[str, ...] = ()

    @classmethod
    def build(cls, raw: dict) -> "SequenceRun":
        existing = {f.name for f in fields(cls)}
        return cls(**{**{k: v for k, v in raw.items() if k in existing}, "steps": tuple(raw.get("steps", ())), "end_condition": tuple(raw.get("end_condition", ()))})

    def as_dict(self) -> dict:
        return {**asdict(self), "steps": list(self.steps), "end_condition": list(self.end_condition)}

    @property
    def text(self) -> str:
        return self.steps[self.step]

    @property
    def last(self) -> bool:
        return self.step >= len(self.steps) - 1

    def advanced(self) -> "SequenceRun":
        return replace(self, step=self.step + 1, adopted_at="", announced_at="", suspension_reason="")

    def adopted(self, time: str) -> "SequenceRun":
        return replace(self, adopted_at=time)

    def announced(self, time: str) -> "SequenceRun":
        return replace(self, announced_at=time)

    def suspended(self, reason: str) -> "SequenceRun":
        return replace(self, suspension_reason=reason)

    @property
    def skipped(self) -> tuple[str, ...]:
        return self.steps[self.step:]

    @property
    def blocks(self) -> str:
        if self.suspension_reason:
            return f"Parked: {self.suspension_reason}"
        return "Taken up" if self.adopted_at else "Not taken up yet: the agent's writes wait until it takes this step up"

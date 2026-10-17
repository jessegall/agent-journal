from dataclasses import asdict, dataclass, fields, replace


@dataclass(frozen=True)
class SequenceRun:
    """A sequence an agent is working through: the steps as they were when it started, the step in hand, the row it is about, when it started, when the step was taken up, when the step was last said, why it is parked when it is, and the states its row must reach before it may end."""

    sequence_id: int
    title: str
    steps: tuple[str, ...]
    step: int = 0
    about: str = ""
    started_at: str = ""
    taken_up_at: str = ""
    said_at: str = ""
    parked_why: str = ""
    finishes_in: tuple[str, ...] = ()

    @classmethod
    def of(cls, raw: dict) -> "SequenceRun":
        known = {f.name for f in fields(cls)}
        return cls(**{**{k: v for k, v in raw.items() if k in known}, "steps": tuple(raw.get("steps", ())), "finishes_in": tuple(raw.get("finishes_in", ()))})

    def as_dict(self) -> dict:
        return {**asdict(self), "steps": list(self.steps), "finishes_in": list(self.finishes_in)}

    @property
    def text(self) -> str:
        return self.steps[self.step]

    @property
    def last(self) -> bool:
        return self.step >= len(self.steps) - 1

    def moved_on(self) -> "SequenceRun":
        return SequenceRun(self.sequence_id, self.title, self.steps, self.step + 1, self.about, self.started_at, finishes_in=self.finishes_in)

    def taken_up(self, at: str) -> "SequenceRun":
        return replace(self, taken_up_at=at)

    def said(self, at: str) -> "SequenceRun":
        return replace(self, said_at=at)

    def parked(self, why: str) -> "SequenceRun":
        return replace(self, parked_why=why)

    @property
    def skipped(self) -> tuple[str, ...]:
        """The step in hand and the ones after it, what giving the run up leaves undone."""
        return self.steps[self.step:]

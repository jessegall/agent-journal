from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class SequenceRun:
    """A sequence an agent is working through: the steps as they were when it started, the step in hand, the row it is about, whether the step was taken up, and why it is parked when it is."""

    sequence_id: int
    title: str
    steps: tuple[str, ...]
    step: int = 0
    about: str = ""
    taken_up: bool = False
    parked_why: str = ""

    @classmethod
    def of(cls, raw: dict) -> "SequenceRun":
        return cls(**{**raw, "steps": tuple(raw.get("steps", ()))})

    def as_dict(self) -> dict:
        return {**asdict(self), "steps": list(self.steps)}

    @property
    def text(self) -> str:
        return self.steps[self.step]

    @property
    def last(self) -> bool:
        return self.step >= len(self.steps) - 1

    def moved_on(self) -> "SequenceRun":
        return SequenceRun(self.sequence_id, self.title, self.steps, self.step + 1, self.about)

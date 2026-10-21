from dataclasses import dataclass


@dataclass(frozen=True)
class SequencesData:
    """The sequences feature's reading for an agent: the run in hand, its step and whether it is parked or taken up, the writes since it was, when the step was last said, whether a line may be typed to the agent, and what else keeps the step quiet: an open question or a debt to the journal."""

    sequence_id: int
    step: int
    step_text: str
    suspension_reason: str
    is_adopted: bool
    adoption_edits: int
    step_repeated: bool
    step_silence_seconds: float
    is_typable: bool
    question_open: bool
    obligations_due: bool

    def has_run(self) -> bool:
        return self.sequence_id > 0

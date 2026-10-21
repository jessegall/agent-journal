from dataclasses import dataclass


@dataclass(frozen=True)
class SequencesSnapshot:
    """The sequences feature's reading for an agent: the run in hand, its step and whether it is parked or taken up, the writes since it was, when the step was last said, whether a line may be typed to the agent, and what else keeps the step quiet: an open question or a debt to the journal."""

    sequence_id: int
    step: int
    step_text: str
    parked_why: str
    is_taken_up: bool
    writes_since_taken_up: int
    step_said_after_last_tool: bool
    step_unsaid_seconds: float
    can_be_typed: bool
    question_open: bool
    debts_owed: bool

    def has_run(self) -> bool:
        return self.sequence_id > 0

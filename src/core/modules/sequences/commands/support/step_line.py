from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun

FOLLOW_HINT = "run `journal sequence follow`, then `journal sequence next` when done"
NEXT_HINT = "run `journal sequence next` when done"


class StepLine:
    """The line that tells the agent the step it is on, and what to run next."""

    @staticmethod
    def text(sequence: Sequence, run: SequenceRun) -> str:
        hint = NEXT_HINT if run.step_started else FOLLOW_HINT
        return f"sequence {sequence.id}, step {run.step_number}: {sequence.steps[run.step_number - 1]}\n{hint}"

from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.models.support.sequence_guards import SequenceGuards

FOLLOW_HINT = "run `journal sequence follow`, then `journal sequence next` when done"
NEXT_HINT = "run `journal sequence next` when done"


class StepLine:
    """The line that tells the agent the step it is on, and what to run next."""

    @staticmethod
    def text(sequence: Sequence, run: SequenceRun) -> str:
        hint = NEXT_HINT if run.step_started else FOLLOW_HINT
        checks = SequenceGuards.step_guard(sequence.step_guards, run.step_number).checks
        required = f"\nthese checks must pass before it moves on: {', '.join(f'check {number}' for number in checks)}" if checks else ""
        return f"sequence {sequence.id}, step {run.step_number}: {sequence.steps[run.step_number - 1]}{required}\n{hint}"

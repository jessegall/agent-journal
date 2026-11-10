from engine.change.created import Created
from engine.change.updated import Updated
from engine.command.context import Context
from engine.guard.guard import Guard
from core.base.module.step_conditions import StepConditions
from engine.errors.refusal import Refusal
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.support.sequence_guards import SequenceGuards


class StepConditionNameGuard(Guard[Created[Sequence] | Updated[Sequence]]):
    """Refuses a sequence whose step names a condition no installed module declares."""

    name = "sequences.known-step-condition"
    is_safety = True

    def __init__(self, conditions: StepConditions) -> None:
        self.conditions = conditions

    def check(self, event: Created[Sequence] | Updated[Sequence], context: Context) -> None:
        unknown = sorted({name for guard in SequenceGuards.parsed(event.row.step_guards) for name in guard.conditions} - self.conditions.names())
        if unknown:
            raise Refusal(f"no module declares the step condition {unknown[0]}", f"the conditions are: {', '.join(sorted(self.conditions.names()))}")

from engine.enums.actor_type import ActorType
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.listener.event_rows import EventRows
from core.base.query.conditions.is_null import IsNull
from engine.errors.refusal import Refusal
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery

PLAN_READY_EVENT = "plan.ready"


class PlanBeingBuiltGuard(Guard[Moved[Plan]]):
    """Refuses an agent that marks a plan ready while the sequence building that plan has steps left."""

    name = "sequences.plan-being-built"
    moves = tuple([PlanLifecycle.ready])
    is_safety = True

    def __init__(self, runs: SequenceRunQuery, rows: EventRows) -> None:
        self.runs, self.rows = runs, rows

    def check(self, event: Moved[Plan], context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        for run in self.runs.filter(subject_id=event.row.id).matching(IsNull("ended_at")).all_rows():
            sequence = self.rows.required(Sequence, run.sequence_id)
            if sequence.has_end_event(PLAN_READY_EVENT) and run.step_number < len(sequence.steps):
                raise Refusal(f"plan {event.row.id} is still being built: step {run.step_number} of sequence {sequence.id}", "finish the sequence's steps first")

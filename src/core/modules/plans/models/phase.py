from dataclasses import dataclass

from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from engine.model.children import Children
from engine.model.positioned import Positioned
from core.modules.plans.models.phase_task import PhaseTask
from core.modules.tasks.models.task import Task


@dataclass(frozen=True, kw_only=True)
class Phase(Positioned, Assignable):
    """One step of a plan, at its place in the plan's order, with what is true when it is done. Only a phase
    flagged as a checkpoint takes a test command of its own; a command an older journal stored on another
    phase is kept. One actor holds a phase, and its assignment also assigns the tasks placed in it."""

    model_name = "phase"
    cli_name = "phase"
    search_fields = ["title", "goal"]
    takes_actors = ActorCount.SINGLE
    assigns = tuple([Children(Task, "phase_id", link_model=PhaseTask, link_column="task_id")])

    plan_id: int
    creator_id: int
    position: int
    title: str
    goal: str = ""
    checkpoint: bool = False
    test_command: str = ""

    def is_test_refused(self, previous: "Phase | None") -> bool:
        is_new_command = previous is None or previous.test_command != self.test_command
        return bool(self.test_command) and not self.checkpoint and is_new_command

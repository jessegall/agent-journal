from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle

TASK_SEPARATOR = ","


@dataclass(frozen=True, kw_only=True)
class CheckpointReach(EnvironmentScoped, Model):
    """A checkpoint of a plan that was reached: the completed tasks of its window as they were when its run
    started, and how the run stands."""

    model_name = "checkpoint_reach"
    cli_name = "checkpoint-reach"
    lifecycle = CheckpointLifecycle

    environment_id: int = 0
    creator_id: int
    plan_id: int
    phase_id: int
    task_ids: str
    state: CheckpointState = CheckpointState.RUNNING

    @classmethod
    def started(cls, creator_id: int, plan_id: int, phase_id: int, task_ids: tuple[int, ...]) -> "CheckpointReach":
        return cls(creator_id=creator_id, plan_id=plan_id, phase_id=phase_id, task_ids=TASK_SEPARATOR.join(map(str, task_ids)))

    def tasks(self) -> tuple[int, ...]:
        return tuple(int(task_id) for task_id in self.task_ids.split(TASK_SEPARATOR) if task_id)

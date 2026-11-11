from dataclasses import dataclass, replace

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from core.modules.plans.models.enums.checkpoint_reach_source import CheckpointReachSource
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle

TASK_SEPARATOR = ","


@dataclass(frozen=True, kw_only=True)
class CheckpointReach(EnvironmentScoped, Model):
    """A checkpoint of a plan that was reached: the completed tasks of its window as they were when its run
    started, and how the run stands. An early reach runs the tasks in testing before the window is done and
    opens no phase; a failed run names the tasks its failures belong to."""

    model_name = "checkpoint_reach"
    cli_name = "checkpoint-reach"
    lifecycle = CheckpointLifecycle

    environment_id: int = 0
    creator_id: int
    plan_id: int
    phase_id: int
    task_ids: str
    state: CheckpointState = CheckpointState.RUNNING
    is_early: bool = False
    source: CheckpointReachSource = CheckpointReachSource.MERGED
    failed_task_ids: str = ""

    @classmethod
    def started(cls, creator_id: int, plan_id: int, phase_id: int, task_ids: tuple[int, ...]) -> "CheckpointReach":
        return cls(creator_id=creator_id, plan_id=plan_id, phase_id=phase_id, task_ids=TASK_SEPARATOR.join(map(str, task_ids)))

    @classmethod
    def started_early(cls, creator_id: int, plan_id: int, phase_id: int, task_ids: tuple[int, ...]) -> "CheckpointReach":
        return replace(cls.started(creator_id, plan_id, phase_id, task_ids), is_early=True, source=CheckpointReachSource.EARLY)

    @classmethod
    def started_worker(cls, creator_id: int, plan_id: int, phase_id: int, task_ids: tuple[int, ...]) -> "CheckpointReach":
        return replace(cls.started(creator_id, plan_id, phase_id, task_ids), source=CheckpointReachSource.WORKER)

    def tasks(self) -> tuple[int, ...]:
        return self.listed(self.task_ids)

    def failed_tasks(self) -> tuple[int, ...]:
        return self.listed(self.failed_task_ids)

    @staticmethod
    def listed(text: str) -> tuple[int, ...]:
        return tuple(int(task_id) for task_id in text.replace(" ", "").split(TASK_SEPARATOR) if task_id)

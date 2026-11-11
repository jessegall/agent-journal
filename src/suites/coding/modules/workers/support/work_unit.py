from dataclasses import dataclass

from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class WorkUnit:
    """The work one dispatch or send gave a worker, as it stands: the plan or the phase it belongs to, if any, the
    ids of its tasks that are not closed, and how many of them are not committed yet."""

    plan: Plan | None
    phase: Phase | None
    task_ids: tuple[int, ...]
    uncommitted_count: int

    @property
    def is_single(self) -> bool:
        return len(self.task_ids) == 1 and self.plan is None

    @property
    def is_committed(self) -> bool:
        return bool(self.task_ids) and self.uncommitted_count == 0

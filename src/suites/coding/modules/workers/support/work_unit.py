from dataclasses import dataclass

from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan


@dataclass(frozen=True)
class WorkUnit:
    """The work one dispatch or send gave a worker, as it stands: the plan or the phase it belongs to, if any, the
    ids of its tasks that are not closed, how many of them are not committed yet, and for the status line how
    many tasks the unit holds in all and how many of those are open."""

    plan: Plan | None
    phase: Phase | None
    task_ids: tuple[int, ...]
    uncommitted_count: int
    total_count: int
    open_count: int

    @property
    def is_single(self) -> bool:
        return len(self.task_ids) == 1 and self.plan is None

    @property
    def has_several_tasks(self) -> bool:
        return self.plan is not None or len(self.task_ids) > 1

    @property
    def is_committed(self) -> bool:
        return bool(self.task_ids) and self.uncommitted_count == 0

    @property
    def status_line(self) -> str:
        if self.plan is not None:
            return f"Unit: plan {self.plan.id}, {self.plan.title}. {self.open_count} of {self.total_count} tasks left; nothing merged yet."
        if self.phase is not None:
            return f"Unit: plan {self.phase.plan_id}, phase {self.phase.position}, {self.phase.title}. {self.open_count} of {self.total_count} tasks left; nothing merged yet."
        if not self.has_several_tasks:
            return ""
        task_list = ", ".join(str(task_id) for task_id in self.task_ids)
        return f"Unit: tasks {task_list}, sent to you together. {self.total_count - self.open_count} of {self.total_count} committed."

    @property
    def name_line(self) -> str:
        if self.plan is not None:
            return f"Your unit is plan {self.plan.id}, {self.plan.title}: {self.total_count} tasks. Work all of it before you report."
        if self.phase is not None:
            return f"Your unit is phase {self.phase.position} of plan {self.phase.plan_id}, {self.phase.title}: {self.total_count} tasks. Work all of it before you report."
        if not self.has_several_tasks:
            return ""
        *first_ids, last_id = (str(task_id) for task_id in self.task_ids)
        return f"Your unit is tasks {', '.join(first_ids)} and {last_id}, sent to you together. Work all of them before you report."

    @property
    def merge_name(self) -> str:
        if self.plan is not None:
            return f"plan {self.plan.id}"
        if self.phase is not None:
            return f"phase {self.phase.position} of plan {self.phase.plan_id}"
        return f"tasks {', '.join(str(task_id) for task_id in self.task_ids)}"

    @property
    def card_name(self) -> str:
        if self.is_committed and self.has_several_tasks:
            return f"Waiting for the merge of {self.merge_name}"
        if self.plan is not None:
            return f"Plan {self.plan.id} · {self.plan.title}"
        if self.phase is not None:
            return f"Plan {self.phase.plan_id}, phase {self.phase.position} · {self.phase.title}"
        return f"{len(self.task_ids)} tasks sent together" if self.has_several_tasks else ""

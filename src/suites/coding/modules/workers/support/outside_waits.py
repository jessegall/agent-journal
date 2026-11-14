from collections.abc import Sequence

from engine.database.kept_rows import KeptRows
from engine.errors.refusal import Refusal
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.assignee_label import AssigneeLabel
from suites.coding.modules.workers.support.assigned_worker_tasks import AssignedWorkerTasks

OPEN_DEPENDENCIES_REASON = "every open wait of the tasks of one unit, and of the tasks they wait on in turn"


class OutsideWaits:
    """Finds the task outside a unit of tasks that holds the whole unit back: every task of the unit waits on it, directly
    or through other tasks of the unit, and it is open or blocked with no worker, assigned to the main agent or a person."""

    def __init__(self, queries: Queries, assigned_worker_tasks: AssignedWorkerTasks, labels: AssigneeLabel, kept: KeptRows) -> None:
        self.queries, self.assigned_worker_tasks, self.labels, self.kept = queries, assigned_worker_tasks, labels, kept

    def check(self, tasks: Sequence[Task]) -> None:
        unit_ids = tuple(sorted(task.id for task in tasks))
        blocker = self.kept.scoped_current(lambda: self.blocker(tasks), name=f"workers.outside_wait_blocker:{unit_ids}")
        if blocker is not None:
            raise Refusal(f"every task waits on task {blocker.id}, which no worker works on: it is assigned to {self.labels.task_label(blocker)}",
                          f"task {blocker.id} is done by {self.labels.task_label(blocker)}; send the tasks once it is done")

    def blocker(self, tasks: Sequence[Task]) -> Task | None:
        unit_ids = {task.id for task in tasks}
        waits: dict[int, set[int]] = {}
        for row in self.queries.query(OpenDependency).matching(Among("task_id", sorted(unit_ids))).every_row(OPEN_DEPENDENCIES_REASON):
            waits.setdefault(row.task_id, set()).add(row.dependency_id)
        external_ids = sorted(set().union(*waits.values()) - unit_ids)
        if not external_ids:
            return None
        unattended = {task.id: task for task in self.assigned_worker_tasks.left_to_nobody(self.queries.query(Task).find_many(external_ids))}
        blockers = [self.first_unattended(task.id, waits, unit_ids, unattended) for task in tasks]
        return None if None in blockers else blockers[0]

    def first_unattended(self, task_id: int, waits: dict[int, set[int]], unit_ids: set[int], unattended: dict[int, Task]) -> Task | None:
        viewed, pending = {task_id}, [task_id]
        while pending:
            for dependency_id in sorted(waits.get(pending.pop(), set()) - viewed):
                viewed.add(dependency_id)
                if dependency_id in unattended:
                    return unattended[dependency_id]
                if dependency_id in unit_ids:
                    pending.append(dependency_id)
        return None

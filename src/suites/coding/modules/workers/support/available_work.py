
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from suites.coding.support.main_options import MainOptions
from suites.coding.support.next_task import NextTask
from suites.coding.support.available_work_answer import AvailableWorkAnswer

MOST_LISTED_TASKS = 5


class AvailableWork:
    """Reads the work the main agent can act on under its workflow controls: a task reserved for it always
    reaches it, and with auto mode on it is handed the next eligible task; while it may send workers and a
    worker can start, open tasks can be delegated; a task it already holds is never offered again. It also
    says whether the agent's stop compacts its context, which no unfinished task holds back."""

    def __init__(self, options: CodingMainOptions, next_task: NextTask, tasks: TaskQuery, worktrees: WorktreeQuery, places: WorkerPlaces) -> None:
        self.options, self.next_task, self.tasks, self.worktrees, self.places = options, next_task, tasks, worktrees, places

    def answer(self, main_agent_id: int) -> AvailableWorkAnswer:
        if self.next_task.exceeds_context_limit(main_agent_id):
            return AvailableWorkAnswer(None, ())
        controls = self.options.options()
        has_started_task = self.tasks.holder(main_agent_id).started().exists()
        assigned_task = None if has_started_task else self.assigned_task(main_agent_id, controls)
        delegatable = self.delegatable(controls.sends_workers)
        return AvailableWorkAnswer(assigned_task, delegatable, self.places.free_count() if delegatable else 0)

    def is_stop_compacting(self, main_agent_id: int) -> bool:
        return self.next_task.allows_stop_with_tasks(main_agent_id)

    def assigned_task(self, main_agent_id: int, controls: MainOptions) -> Task | None:
        return self.next_task.following(main_agent_id) if controls.auto else self.next_task.reserved(main_agent_id)

    def delegatable(self, sends_workers: bool) -> tuple[int, ...]:
        if not sends_workers or not self.places.can_start_new():
            return ()
        waiting = self.tasks.delegation_candidates([worktree.session_agent_id for worktree in self.worktrees.open_worktrees()])
        return tuple(task.id for task in waiting.oldest().limited(MOST_LISTED_TASKS))

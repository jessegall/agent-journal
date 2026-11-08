
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from suites.coding.support.coding_main_options import CodingMainOptions
from suites.coding.support.next_task import NextTask
from suites.coding.support.available_work_answer import AvailableWorkAnswer

MOST_LISTED_TASKS = 5


class AvailableWork:
    """Reads the work the main agent can act on under its workflow controls: with auto mode on it is handed
    the next eligible task; while it may send workers and a worker can start, open tasks can be delegated;
    a task it already holds is never offered again."""

    def __init__(self, options: CodingMainOptions, next_task: NextTask, tasks: TaskQuery, worktrees: WorktreeQuery, places: WorkerPlaces) -> None:
        self.options, self.next_task, self.tasks, self.worktrees, self.places = options, next_task, tasks, worktrees, places

    def answer(self, main_agent_id: int) -> AvailableWorkAnswer:
        if self.next_task.holds_back_from(main_agent_id):
            return AvailableWorkAnswer(None, ())
        controls = self.options.options()
        holds_started_task = self.tasks.holder(main_agent_id).started().exists()
        own_task = self.next_task.following() if controls.auto and not holds_started_task else None
        delegatable = self.delegatable(controls.sends_workers)
        return AvailableWorkAnswer(own_task, delegatable, self.places.free_count() if delegatable else 0)

    def delegatable(self, may_send: bool) -> tuple[int, ...]:
        if not may_send or not self.places.can_start_new():
            return ()
        waiting = self.tasks.delegation_candidates([worktree.session_agent_id for worktree in self.worktrees.open_worktrees()])
        return tuple(task.id for task in waiting.oldest().limited(MOST_LISTED_TASKS))

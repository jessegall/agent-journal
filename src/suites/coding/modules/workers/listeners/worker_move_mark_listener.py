from core.base.change.logged_event import LoggedEvent
from core.modules.agents.models.agent import Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.worktree import Worktree

AGENTS_TABLE = "agents"
MOVE_TEXTS = {
    "worker_worktree.cut": (WorkerMarkVariant.STARTED, "started task {task}"),
    "worker_worktree.advance": (WorkerMarkVariant.NEXT_TASK, "started task {task}"),
    "worker_worktree.deliver": (WorkerMarkVariant.DELIVERED, "handed in task {task}"),
    "worker_worktree.merge": (WorkerMarkVariant.MERGED, "had task {task} merged"),
    "worker_worktree.abandon": (WorkerMarkVariant.RELEASED, "released task {task}"),
}


class WorkerMoveMarkListener(MarkListener):
    """Each move of a worker shows as a mark in the chat naming the task, with the program and the task's title and
    brief shown on opening it, and a click that opens the worker."""

    name = "workers.move-mark"
    event = "worker_worktree.*"
    module_name = "journal.suites.coding.workers"

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in MOVE_TEXTS:
            return
        worktree = self.queries.query(Worktree).find(event.row_id)
        agent = self.queries.query(Agent).find(worktree.agent_id)
        task = self.queries.query(Task).find(worktree.task_id)
        variant, move = MOVE_TEXTS[event.event]
        self.show(event, WorkerMarkType.WORKER, variant, f"Worker {agent.id} {move.format(task=task.id)}", worktree.environment_id, None, AGENTS_TABLE, agent.id, detail=f"On {agent.program}\n\nTask {task.id}: {task.title}\n\n{task.brief}")

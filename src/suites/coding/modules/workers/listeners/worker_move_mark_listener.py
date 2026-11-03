from core.base.change.logged_event import LoggedEvent
from core.base.query.conditions.among import Among
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.worktree import Worktree

DELIVERY_MOVE = "worker_worktree.deliver"
MOVE_TEXTS = {
    "worker_worktree.cut": (WorkerMarkVariant.STARTED, "started {tasks}"),
    "worker_worktree.advance": (WorkerMarkVariant.NEXT_TASK, "started {tasks}"),
    "worker_worktree.deliver": (WorkerMarkVariant.DELIVERED, "handed in {tasks}"),
    "worker_worktree.merge": (WorkerMarkVariant.MERGED, "had {tasks} merged"),
    "worker_worktree.abandon": (WorkerMarkVariant.RELEASED, "released {tasks}"),
}


class WorkerMoveMarkListener(MarkListener):
    """Each move of a worker shows as a mark in the chat naming the worker and the task, with the program, the
    model, the tasks still queued and the task's title and brief shown on opening it, and a click that opens
    the worker."""

    name = "workers.move-mark"
    event = "worker_worktree.*"
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in MOVE_TEXTS:
            return
        worktree = self.queries.query(Worktree).find(event.row_id)
        agent = self.queries.query(Agent).find(worktree.agent_id)
        task = self.queries.query(Task).find(worktree.task_id)
        variant, move = MOVE_TEXTS[event.event]
        name = agent.given_name or f"Worker {agent.id}"
        self.show(event, WorkerMarkType.WORKER, variant, f"{name} {move.format(tasks=self.tasks_text(event.event, worktree, task))}", worktree.environment_id, None, AGENTS_TABLE, agent.id, detail=f"On {agent.program} {agent.program_model}{self.queue_text(agent)}\n\nTask {task.id}: {task.title}\n\n{task.brief}")

    def queue_text(self, agent: Agent) -> str:
        queued = self.queries.query(Task).filter(delegated_to=agent.id, state=TaskState.OPEN).oldest().all_rows()
        names = ", ".join(f"task {row.id}" for row in queued)
        return f"\n\nQueued: {names}" if names else ""

    def tasks_text(self, move: str, worktree: Worktree, task: Task) -> str:
        if move != DELIVERY_MOVE:
            return f"task {task.id}"
        delivered = self.queries.query(Task).filter(delegated_to=worktree.agent_id).matching(Among("state", (TaskState.TESTING, TaskState.COMPLETED))).all_rows()
        return ", ".join(f"task {row.id}" for row in sorted(delivered, key=lambda row: row.id))

from core.base.change.logged_event import LoggedEvent
from core.base.query.conditions.among import Among
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.worktree import Worktree
from core.base.change.changed import Changed

DELIVERY_MOVE = "worker_worktree.deliver"
CUT_MOVE = "worker_worktree.cut"
MOVE_TEXTS = {
    "worker_worktree.cut": (WorkerMarkVariant.STARTED, "started {tasks}"),
    "worker_worktree.advance": (WorkerMarkVariant.NEXT_TASK, "started {tasks}"),
    "worker_worktree.deliver": (WorkerMarkVariant.DELIVERED, "handed in {tasks}"),
    "worker_worktree.merge": (WorkerMarkVariant.MERGED, "had {tasks} merged"),
    "worker_worktree.abandon": (WorkerMarkVariant.RELEASED, "released {tasks}"),
}


class WorkerMoveMarkListener(MarkListener[Changed[Worktree]]):
    """Each move of a worker shows as a mark in the chat naming the worker and the task, with the program, the
    model, the tasks still queued and the task's title and brief shown on opening it, and a click that opens
    the worker; a worker started on queued tasks that all belong to one plan also shows the plan handed to it."""

    name = "workers.move-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def handle(self, event: Changed[Worktree], logged: LoggedEvent) -> None:
        if logged.event not in MOVE_TEXTS:
            return
        worktree = event.row
        agent = self.queries.query(Agent).find(worktree.agent_id)
        task = self.queries.query(Task).find(worktree.task_id)
        variant, move = MOVE_TEXTS[logged.event]
        name = agent.given_name or f"Worker {agent.id}"
        self.show(logged, WorkerMarkType.WORKER, variant, f"{name} {move.format(tasks=self.tasks_text(logged.event, worktree, task))}", worktree.environment_id, None, AGENTS_TABLE, agent.id, detail=f"On {agent.program} {agent.program_model}{self.queue_text(agent)}\n\nTask {task.id}: {task.title}\n\n{task.brief}")
        if logged.event == CUT_MOVE:
            self.show_plan(logged, worktree, agent, name)

    def show_plan(self, logged: LoggedEvent, worktree: Worktree, agent: Agent, name: str) -> None:
        queued = self.queries.query(Task).filter(delegated_to=agent.id, state=TaskState.OPEN).oldest().all_rows()
        task_ids = (worktree.task_id, *(row.id for row in queued))
        plan_tasks = tuple(self.queries.query(PlanTask).matching(Among("task_id", task_ids)).all_rows())
        plan_ids = {row.plan_id for row in plan_tasks}
        if len(task_ids) > 1 and len(plan_tasks) == len(task_ids) and len(plan_ids) == 1:
            plan_id = plan_ids.pop()
            self.show(logged, WorkerMarkType.WORKER, WorkerMarkVariant.HANDED_PLAN, f"{name} was handed plan {plan_id}", worktree.environment_id, None, AGENTS_TABLE, agent.id,
                      detail=", ".join(f"task {task_id}" for task_id in task_ids))

    def queue_text(self, agent: Agent) -> str:
        queued = self.queries.query(Task).filter(delegated_to=agent.id, state=TaskState.OPEN).oldest().all_rows()
        names = ", ".join(f"task {row.id}" for row in queued)
        return f"\n\nQueued: {names}" if names else ""

    def tasks_text(self, move: str, worktree: Worktree, task: Task) -> str:
        if move != DELIVERY_MOVE:
            return f"task {task.id}"
        delivered = self.queries.query(Task).filter(delegated_to=worktree.agent_id).matching(Among("state", (TaskState.TESTING, TaskState.COMPLETED))).all_rows()
        return ", ".join(f"task {row.id}" for row in sorted(delivered, key=lambda row: row.id))

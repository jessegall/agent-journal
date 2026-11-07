from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.listener.event_rows import EventRows
from core.base.query.conditions.among import Among
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.worktree import Worktree
from core.base.change.moved import Moved
from core.base.model.move import Move
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle

MOVE_TEXTS = {
    "cut": (WorkerMarkVariant.STARTED, "started {tasks}"),
    "advance": (WorkerMarkVariant.NEXT_TASK, "started {tasks}"),
    "deliver": (WorkerMarkVariant.DELIVERED, "handed in {tasks}"),
    "merge": (WorkerMarkVariant.MERGED, "had {tasks} merged"),
    "abandon": (WorkerMarkVariant.RELEASED, "released {tasks}"),
}


class WorkerMoveMarkListener(MarkListener[Moved[Worktree]]):
    """Each move of a worker shows as a mark in the chat naming the worker and the task, with the program, the
    model, the tasks still queued and the task's title and brief shown on opening it, and a click that opens
    the worker; a worker started on queued tasks that all belong to one plan also shows the plan handed to it."""

    name = "workers.move-mark"
    moves = (WorktreeLifecycle.cut, WorktreeLifecycle.advance, WorktreeLifecycle.deliver, WorktreeLifecycle.merge, WorktreeLifecycle.abandon, WorktreeLifecycle.pass_to_main)
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, event_rows: EventRows, tasks: TaskQuery) -> None:
        super().__init__(bus, actors, queries, event_rows)
        self.tasks = tasks

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        worktree = event.row
        agent = self.event_rows.required(Agent, worktree.session_agent_id)
        if event.move is WorktreeLifecycle.pass_to_main:
            name = agent.given_name or f"Worker {agent.id}"
            reason = str(logged.data.get("left_to_main_reason", ("", worktree.left_to_main_reason))[1])
            self.show(logged, WorkerMarkType.WORKER, WorkerMarkVariant.LEFT_TO_MAIN, f"The merger left {name} to the main agent", None, AGENTS_TABLE, agent.id, detail=reason)
            return
        task = self.event_rows.required(Task, worktree.task_id)
        queued = self.tasks.queued_tasks(agent.id)
        variant, move = MOVE_TEXTS[event.move.name]
        name = agent.given_name or f"Worker {agent.id}"
        self.show(logged, WorkerMarkType.WORKER, variant, f"{name} {move.format(tasks=self.tasks_text(event.move, worktree, task))}", None, AGENTS_TABLE, agent.id, detail=f"On {agent.program} {agent.program_model}{self.queue_text(queued)}\n\nTask {task.id}: {task.title}\n\n{task.brief}")
        if event.move is WorktreeLifecycle.cut:
            self.show_plan(logged, worktree, agent, name, (worktree.task_id, *(row.id for row in queued)))

    def show_plan(self, logged: LoggedEvent, worktree: Worktree, agent: Agent, name: str, task_ids: tuple[int, ...]) -> None:
        plan_tasks = tuple(self.queries.query(PlanTask).matching(Among("task_id", task_ids)).all_rows())
        plan_ids = {row.plan_id for row in plan_tasks}
        if len(task_ids) > 1 and len(plan_tasks) == len(task_ids) and len(plan_ids) == 1:
            plan_id = plan_ids.pop()
            self.show(logged, WorkerMarkType.WORKER, WorkerMarkVariant.HANDED_PLAN, f"{name} was handed plan {plan_id}", None, AGENTS_TABLE, agent.id,
                      detail=", ".join(f"task {task_id}" for task_id in task_ids))

    def queue_text(self, queued: tuple[Task, ...]) -> str:
        names = ", ".join(f"task {row.id}" for row in queued)
        return f"\n\nQueued: {names}" if names else ""

    def tasks_text(self, move: Move, worktree: Worktree, task: Task) -> str:
        if move is not WorktreeLifecycle.deliver:
            return f"task {task.id}"
        delivered = self.queries.query(Task).filter(delegated_to=worktree.session_agent_id).matching(Among("state", (TaskState.TESTING, TaskState.COMPLETED))).all_rows()
        return ", ".join(f"task {row.id}" for row in sorted(delivered, key=lambda row: row.id))

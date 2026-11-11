from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.listener.event_rows import EventRows
from engine.query.conditions.among import Among
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TASK_PAGE_ROWS, TaskQuery
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.worktree import Worktree
from engine.event.moved import Moved
from engine.model.move import Move
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
    moves = (WorktreeLifecycle.cut, WorktreeLifecycle.advance, WorktreeLifecycle.deliver, WorktreeLifecycle.merge, WorktreeLifecycle.abandon, WorktreeLifecycle.return_worker)
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, event_rows: EventRows, tasks: TaskQuery) -> None:
        super().__init__(bus, actors, queries, event_rows)
        self.tasks = tasks

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        worktree = event.row
        agent = self.event_rows.required(Agent, worktree.session_agent_id)
        if event.required_move is WorktreeLifecycle.return_worker:
            name = agent.given_name or f"Worker {agent.id}"
            reason = str(logged.data.get("pass_reason", ("", worktree.pass_reason))[1])
            self.show(logged, WorkerMarkType.WORKER, WorkerMarkVariant.PASS, f"The merger left {name} to the main agent", None, AGENTS_TABLE, agent.id, detail=reason)
            return
        task = self.event_rows.required(Task, worktree.task_id)
        queued = self.tasks.assigned(agent.id)
        variant, move = MOVE_TEXTS[event.required_move.name]
        name = agent.given_name or f"Worker {agent.id}"
        choice_reason = f"; {worktree.route_reason}" if worktree.route_reason else ""
        self.show(logged, WorkerMarkType.WORKER, variant, f"{name} {move.format(tasks=self.tasks_text(event.required_move, worktree, task))}", None, AGENTS_TABLE, agent.id, detail=f"On {agent.program} {agent.program_model}{choice_reason}{self.queue_text(queued)}\n\nTask {task.id}: {task.title}\n\n{task.brief}")
    def queue_text(self, queued: tuple[Task, ...]) -> str:
        names = ", ".join(f"task {row.id}" for row in queued)
        return f"\n\nQueued: {names}" if names else ""

    def tasks_text(self, move: Move, worktree: Worktree, task: Task) -> str:
        if move is not WorktreeLifecycle.deliver:
            return f"task {task.id}"
        delivered = self.tasks.assignee_tasks(worktree.session_agent_id).matching(Among("state", (TaskState.TESTING, TaskState.COMPLETED))).oldest().all_rows(TASK_PAGE_ROWS)
        return ", ".join(f"task {row.id}" for row in sorted(delivered, key=lambda row: row.id))

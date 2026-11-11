from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.commands.start_next_worker_task.start_next_worker_task import StartNextWorkerTask
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance

COMMIT_HINT = "journal worker commit commits the tasks you have proved"


class StartNextWorkerTaskHandler(Handler[StartNextWorkerTask, Task]):
    """Starts the next task a worker may start, by priority and then the order of its plan, beside the tasks it
    has started. It commits, judges and tests nothing: journal worker commit does that. The worktree goes to
    the new task only when its own task is no longer started."""

    command = StartNextWorkerTask
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, repository: Repository, bus: Bus, guidance: WorkerGuidance) -> None:
        self.rows, self.worktrees, self.repository, self.bus, self.guidance = rows, worktrees, repository, bus, guidance

    def check_rows(self, command: StartNextWorkerTask, actor: Actor) -> None:
        self.following_task(actor.id)

    def following_task(self, worker_id: int) -> Task:
        point = self.guidance.point(worker_id)
        worktree = point.round.worktree
        if worktree is None or worktree.state is not WorktreeState.CUT or point.step is WorkerStep.BLOCKED:
            raise Refusal(point.line)
        if point.round.following is None:
            raise Refusal("no task is left to start", AskTopic.GENERAL.hint(COMMIT_HINT))
        return point.round.following

    def handle(self, command: StartNextWorkerTask, context: Context) -> Task:
        following = self.following_task(context.actor.id)
        started = self.bus.dispatch(StartTask(following.id), context)
        worktree = self.worktrees.required_worker_worktree(context.actor.id)
        if self.rows.required(Task, worktree.task_id).state is not TaskState.STARTED:
            self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.advance, task_id=following.id), context)
        return started

from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog
from suites.coding.modules.workers.commands.read_worker_logs.read_worker_logs import ReadWorkerLogs
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class ReadWorkerLogsHandler(Handler[ReadWorkerLogs, str]):
    command = ReadWorkerLogs
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, worktrees: WorktreeQuery, queries: Queries, repository: Repository) -> None:
        self.agents, self.worktrees, self.queries, self.repository = agents, worktrees, queries, repository

    def handle(self, command: ReadWorkerLogs, context: Context) -> str:
        if context.actor.type is not ActorType.AGENT or not self.agents.is_main(context.actor.id):
            raise Refusal("only the main agent reviews a worker's logs", "ask the main agent to read them")
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None or worktree.state is not WorktreeState.DELIVERED:
            raise Refusal(f"worker {command.worker_id} has delivered nothing to review", "journal worker-worktree list shows the worktrees")
        tasks = tuple(self.queries.query(Task).filter(delegated_to=command.worker_id).matching(Among("state", [TaskState.TESTING, TaskState.COMPLETED])).oldest().all_rows())
        logs = tuple(self.queries.query(TaskLog).filter(creator_id=command.worker_id).matching(Among("task_id", [task.id for task in tasks])).oldest().all_rows())
        sections = []
        for task in tasks:
            lines = [log.line for log in logs if log.task_id == task.id]
            sections.append(f"task {task.id}: {task.title}\noutcome: {task.outcome}\n" + ("\n".join(lines) if lines else "no log lines"))
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.review_logs, logs_read_at=context.timestamp), context)
        return "\n\n".join(sections)

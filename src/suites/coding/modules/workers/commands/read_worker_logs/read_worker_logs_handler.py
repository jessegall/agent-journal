from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.read_worker_logs.read_worker_logs import ReadWorkerLogs
from suites.coding.modules.workers.support.worker_log_lines import WorkerLogLines
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class ReadWorkerLogsHandler(Handler[ReadWorkerLogs, str]):
    command = ReadWorkerLogs
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, worktrees: WorktreeQuery, log_lines: WorkerLogLines, repository: Repository) -> None:
        self.agents, self.worktrees, self.log_lines, self.repository = agents, worktrees, log_lines, repository

    def handle(self, command: ReadWorkerLogs, context: Context) -> str:
        if context.actor.type is not ActorType.AGENT or not self.agents.is_main(context.actor.id):
            raise Refusal("only the main agent reviews a worker's logs", "ask the main agent to read them")
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None or worktree.state is not WorktreeState.DELIVERED:
            raise Refusal(f"worker {command.worker_id} has delivered nothing to review", "journal worker-worktree list shows the worktrees")
        review = self.log_lines.review(command.worker_id)
        sections = [review.summary(task) if command.task_id is None else review.whole(task) for task in review.tasks if command.task_id in (None, task.id)]
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.review_logs, logs_read_at=context.timestamp), context)
        return "\n\n".join(sections)

from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.commands.read_worker_logs.read_worker_logs import ReadWorkerLogs
from suites.coding.modules.workers.support.worker_log_lines import WorkerLogLines
from suites.coding.modules.workers.support.worker_log_read import WorkerLogRead
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class ReadWorkerLogsHandler(Handler[ReadWorkerLogs, str]):
    command = ReadWorkerLogs
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, environments: EnvironmentRows, worktrees: WorktreeQuery, log_lines: WorkerLogLines, log_read: WorkerLogRead) -> None:
        self.agents, self.environments, self.worktrees, self.log_lines, self.log_read = agents, environments, worktrees, log_lines, log_read

    def handle(self, command: ReadWorkerLogs, context: Context) -> str:
        if not self.reviews_logs(context):
            raise Refusal("only the main agent reviews a worker's logs", "ask the main agent to read them")
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None or worktree.state is not WorktreeState.DELIVERED:
            raise Refusal(f"worker {command.worker_id} has delivered nothing to review", "journal worker-worktree list shows the worktrees")
        review = self.log_lines.review(worktree)
        sections = [review.summary(task) if command.task_id is None else review.whole(task) for task in review.tasks if command.task_id in (None, task.id)]
        text = "\n\n".join(sections)
        if review.covers_all_tasks(command.task_id):
            output_id = self.log_read.pending_output(text, command.process_id, command.json_output, context)
            self.log_read.record(worktree, output_id, context)
        return text

    def reviews_logs(self, context: Context) -> bool:
        if context.actor.type is not ActorType.AGENT:
            return False
        return self.environments.find(context.environment_id).grants(context.actor.id) or self.agents.is_main(context.actor.id)

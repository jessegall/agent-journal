from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.commands.read_worker_logs.read_worker_logs import ReadWorkerLogs
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE
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
        reviews_logs = self.reviews_logs(context)
        is_merger = not reviews_logs and self.is_merger(context)
        if not (reviews_logs or is_merger):
            raise Refusal("only the main agent or the merger reviews a worker's logs", "ask the main agent to read them")
        worktree = self.worktrees.worker_worktree(command.worker_id)
        is_delivered = worktree is not None and worktree.state is WorktreeState.DELIVERED
        if worktree is None or not (is_delivered or is_merger):
            raise Refusal(f"worker {command.worker_id} has delivered nothing to review", "journal worker-worktree list shows the worktrees")
        review = self.log_lines.review(worktree)
        sections = [review.summary(task) if command.task_id is None else review.whole(task) for task in review.tasks if command.task_id in (None, task.id)]
        text = "\n\n".join(sections)
        if is_delivered and review.covers_all_tasks(command.task_id):
            output_id = self.log_read.pending_output(text, command.process_id, command.json_output, context)
            self.log_read.record(worktree, output_id, context)
        return text

    def is_merger(self, context: Context) -> bool:
        return context.actor.type is ActorType.AGENT and self.agents.has_profile(context.actor.id, MERGER_PROFILE)

    def reviews_logs(self, context: Context) -> bool:
        if context.actor.type is not ActorType.AGENT:
            return False
        return self.environments.grants(context.required_environment_id(), context.actor.id) or self.agents.is_main(context.actor.id)

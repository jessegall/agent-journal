from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_nudges import WORKER_UNSTARTED
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.journal_home import JournalHome
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery

START_SECONDS = 60
LOG_CHARACTERS = 180


class UnstartedWorkerRule(DriverRule):
    """A tick tells the main agent of each worker whose program has made no hook call a minute after its
    dispatch, with the end of its terminal log, so a program that was refused at its start is seen at once."""

    name = "workers.unstarted-worker"
    hook = HookEventName.TICK
    drivers = ["coding.builder", "coding.orchestrator"]
    roles = [AgentRole.MAIN]
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorkerWorktrees, queries: Queries, calls: HookCallQuery, home: JournalHome) -> None:
        self.worktrees, self.queries, self.calls, self.home = worktrees, queries, calls, home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        workers = [self.queries.query(Agent).find(worktree.agent_id) for worktree in self.worktrees.main_worktrees(hook.agent_id) if worktree.state is WorktreeState.CUT]
        return RuleAnswer.with_nudges(*(WORKER_UNSTARTED.nudge(worker=worker.id, seconds=START_SECONDS, hint=self.log_end(worker)) for worker in workers if self.is_unstarted(worker, hook)))

    def is_unstarted(self, worker: Agent, hook: AgentHook) -> bool:
        started_at = worker.created_at
        return worker.ended_at is None and started_at is not None and started_at.elapsed_seconds(hook.timestamp) >= START_SECONDS and self.calls.newest_agent_hook(worker.id) is None

    def log_end(self, worker: Agent) -> str:
        path = self.home.terminal_file(worker.terminal_id)
        return " ".join(path.read_text(errors="replace").split())[-LOG_CHARACTERS:] if path.is_file() else "it wrote nothing"

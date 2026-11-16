from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.agent_machine.states.line_history import LineHistory
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.driver.seconds import Seconds
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.listener.rows.event_rows import EventRows
from engine.time.clock import Clock
from core.modules.environments.models.environment import Environment
from suites.coding.modules.workers.agent_messages.merge_waits_message import MergeWaitsMessage
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

REMINDER_SPAN = Seconds(3600)


class MergeCheckoutLines(EventLineSource):
    """At its minute step the main agent is told, once an hour, which branch the checkout must be on for a checked
    merge."""

    key = "workers.merge-waits-for-checkout"
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, rows: EventRows, delivered: WorkerWorktrees, proofs: ProofQuery, git: WorktreeGit, history: LineHistory, numbers: RowNumbers, clock: Clock) -> None:
        self.rows, self.delivered, self.proofs, self.git, self.history, self.numbers, self.clock = rows, delivered, proofs, git, history, numbers, clock

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        last_given_at = self.history.last_given(self.key, agent_id)
        if last_given_at is not None and last_given_at.elapsed_seconds(self.clock.timestamp()) < REMINDER_SPAN.count:
            return []
        delivered = list(self.delivered.delivered())
        environments = self.rows.required_index(Environment, [worktree.environment_id for worktree in delivered])
        return [MergeWaitsMessage.declared().agent_message(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), environment=environments[worktree.environment_id].name,
                                                 branch=worktree.base_branch)
                for worktree in delivered if not self.proofs.waiting_proofs(worktree.id).exists() and self.git.head(environments[worktree.environment_id].folder) != worktree.base_branch]

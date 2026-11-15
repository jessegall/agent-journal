from engine.time.clock import Clock
from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from suites.coding.modules.workers.types.worker import Worker
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.nudges.worker_log_due_message import WorkerLogDueMessage

LOG_DUE_MINUTES = 30


class WorkerLogDueLines(EventLineSource):
    """A worker that has shown no proof for thirty minutes since its worktree or its last proof is told to log
    where it stands."""

    key = "workers.worker-log-due"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [Worker.key]

    def __init__(self, worktrees: WorktreeQuery, queries: Queries, clock: Clock) -> None:
        self.worktrees, self.queries = worktrees, queries
        self.clock = clock

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        worktree = self.worktrees.worker_worktree(agent_id)
        if worktree is None:
            return []
        latest_proof = self.queries.query(Proof).filter(worktree_id=worktree.id).newest().first()
        latest = latest_proof.creation_timestamp() if latest_proof is not None else worktree.creation_timestamp()
        minutes = latest.elapsed_minutes(self.clock.timestamp())
        return [WorkerLogDueMessage.declared().nudge(minutes=minutes)] if minutes >= LOG_DUE_MINUTES else []

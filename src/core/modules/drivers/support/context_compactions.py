from dataclasses import replace

from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.context_compaction import ContextCompaction
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from core.modules.drivers.models.enums.context_change import ContextChange


class ContextCompactions:
    """The compactions and clears of agents' contexts, one row each. It is the one place that records a request,
    and it refuses a second one while the first is open: started, or requested less than the retry time ago. A
    request whose line never started by then is given up, and the next request takes its place. The hooks move
    the newest row as the program starts and ends the compaction."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def newest(self, agent_id: int) -> ContextCompaction | None:
        return self.queries.query(ContextCompaction).filter(session_agent_id=agent_id).descending("id").first()

    def open_compaction(self, agent_id: int) -> ContextCompaction | None:
        newest = self.newest(agent_id)
        return newest if newest is not None and newest.state.is_open else None

    def blocks_request(self, agent_id: int, timestamp: Timestamp) -> bool:
        newest = self.newest(agent_id)
        return newest is not None and newest.blocks_request_at(timestamp)

    def request(self, agent_id: int, change: ContextChange, reason: CompactionReason, request_tokens: int | None, line: str, context: Context) -> ContextCompaction:
        newest = self.newest(agent_id)
        if newest is not None and newest.blocks_request_at(context.timestamp):
            raise Refusal(newest.refusal_text(), "wait for it to end before asking again")
        unstarted = self.open_compaction(agent_id)
        if unstarted is not None:
            self.repository.save(replace(unstarted, state=CompactionState.ABANDONED), context)
        return self.repository.save(ContextCompaction(session_agent_id=agent_id, change=change, reason=reason, line=line, request_tokens=request_tokens), context)

    def record_start(self, agent_id: int, context: Context) -> None:
        newest = self.newest(agent_id)
        if newest is not None and newest.state is CompactionState.REQUESTED:
            self.repository.save(replace(newest, state=CompactionState.STARTED, started_at=context.timestamp), context)

    def record_end(self, agent_id: int, context: Context) -> None:
        running = self.open_compaction(agent_id)
        if running is not None:
            self.repository.save(replace(running, state=CompactionState.ENDED, ended_at=context.timestamp), context)

    def record_tokens_after(self, agent_id: int, tokens: int, context: Context) -> None:
        newest = self.newest(agent_id)
        if newest is not None and newest.state is CompactionState.ENDED:
            self.repository.save(replace(newest, state=CompactionState.MEASURED, tokens_after=tokens), context)

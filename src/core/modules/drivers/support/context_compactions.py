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
    """The compactions and clears of agents' contexts, one row each. It is the one place that says whether a
    context size makes a new compaction due and the one place that records a request, and it refuses a
    second one while the first is open: started, or requested less than the retry time ago. A request whose
    line never started by then is given up, and the next request takes its place. The hooks move the newest
    row as the program starts and ends the compaction; a compaction the journal did not ask for gets its row
    at its first hook, and a row still open when the program's session ends or starts anew is given up."""

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

    def requires_compaction(self, agent_id: int, tokens: int, limit_tokens: int, growth_percent: int) -> bool:
        newest = self.newest(agent_id)
        due_tokens = newest.due_tokens(limit_tokens, growth_percent) if newest is not None else limit_tokens
        return due_tokens is not None and tokens >= due_tokens

    def request(self, agent_id: int, change: ContextChange, reason: CompactionReason, request_tokens: int | None, line: str, context: Context) -> ContextCompaction:
        newest = self.newest(agent_id)
        if newest is not None and newest.blocks_request_at(context.timestamp):
            raise Refusal(newest.refusal_text(), "wait for it to end before asking again")
        self.abandon_open(agent_id, context)
        return self.repository.save(ContextCompaction(session_agent_id=agent_id, change=change, reason=reason, line=line, request_tokens=request_tokens), context)

    def record_start(self, agent_id: int, reason: CompactionReason, context: Context) -> None:
        running = self.open_compaction(agent_id)
        if running is None:
            self.repository.save(ContextCompaction(session_agent_id=agent_id, change=ContextChange.COMPACT, reason=reason, state=CompactionState.STARTED, started_at=context.timestamp), context)
        elif running.state is CompactionState.REQUESTED:
            self.repository.save(replace(running, state=CompactionState.STARTED, started_at=context.timestamp), context)

    def record_end(self, agent_id: int, context: Context) -> None:
        running = self.open_compaction(agent_id)
        if running is not None:
            self.repository.save(replace(running, state=CompactionState.ENDED, ended_at=context.timestamp), context)
            return
        newest = self.newest(agent_id)
        if newest is None or newest.state is not CompactionState.ENDED:
            self.repository.save(ContextCompaction(session_agent_id=agent_id, change=ContextChange.COMPACT, reason=CompactionReason.AUTO, state=CompactionState.ENDED, ended_at=context.timestamp), context)

    def abandon_open(self, agent_id: int, context: Context) -> None:
        unfinished = self.open_compaction(agent_id)
        if unfinished is not None:
            self.repository.save(replace(unfinished, state=CompactionState.ABANDONED), context)

    def record_tokens_after(self, agent_id: int, tokens: int, context: Context) -> None:
        newest = self.newest(agent_id)
        if newest is not None and newest.state is CompactionState.ENDED:
            self.repository.save(replace(newest, state=CompactionState.MEASURED, tokens_after=tokens), context)

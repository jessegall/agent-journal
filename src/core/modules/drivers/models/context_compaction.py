from collections.abc import Mapping
from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from core.modules.drivers.models.enums.context_change import ContextChange
from core.modules.settings.support.context_reading import PERCENT_FULL

RETRY_SECONDS = 180


@dataclass(frozen=True, kw_only=True)
class ContextCompaction(Model):
    """One compaction or clear of one agent's context, from the line that asked for it to the first context
    size read after it ended. The line is the text typed into the agent's terminal. A compaction that left the
    context at the limit or over it did not help, so the next one is due only once the context has grown by a
    share of the limit; until the size after it is read, no next one is due. The agent is woken once after the
    compaction ends, and the row keeps when. The journal asks a second time when a request did not start within
    the retry time, and no third time: a request that repeats one, and a compaction that failed, block the
    journal's next request until a person asks or the program compacts by itself."""

    model_name = "context_compaction"
    cli_name = "context-compaction"
    shared_rows = True

    session_agent_id: int
    change: ContextChange
    reason: CompactionReason
    state: CompactionState = CompactionState.REQUESTED
    line: str = ""
    request_tokens: int | None = None
    tokens_after: int | None = None
    started_at: Timestamp | None = None
    ended_at: Timestamp | None = None
    woken_at: Timestamp | None = None
    is_retry: bool = False
    failure: str = ""

    def is_newly_ended(self, previous: "ContextCompaction | None") -> bool:
        if self.change is not ContextChange.COMPACT or self.state is not CompactionState.ENDED:
            return False
        return previous is None or previous.state is not CompactionState.ENDED

    def blocks_request_at(self, timestamp: Timestamp) -> bool:
        if self.state is CompactionState.FAILED or (self.state is CompactionState.REQUESTED and self.is_retry):
            return True
        return self.blocks_person_request_at(timestamp)

    def blocks_person_request_at(self, timestamp: Timestamp) -> bool:
        if self.state is CompactionState.STARTED:
            return True
        return self.state is CompactionState.REQUESTED and self.creation_timestamp().elapsed_seconds(timestamp) < RETRY_SECONDS

    def due_tokens(self, limit_tokens: int, growth_percent: int) -> int | None:
        if self.state is CompactionState.ENDED:
            return None
        if self.tokens_after is None or self.tokens_after < limit_tokens:
            return limit_tokens
        return self.tokens_after + max(limit_tokens * growth_percent // PERCENT_FULL, 1)

    def refusal_text(self) -> str:
        return f"a {self.change.value} is {self.state.value} since {self.creation_timestamp().value.strftime('%H:%M')}"

    def json(self) -> Mapping[str, object]:
        return {"change": self.change.value, "reason": self.reason.value, "state": self.state.value, "requested_at": self.creation_timestamp().text, "is_open": self.state.is_open,
                "request_tokens": self.request_tokens, "tokens_after": self.tokens_after}

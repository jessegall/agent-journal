from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from core.modules.drivers.models.enums.context_change import ContextChange

RETRY_SECONDS = 180


@dataclass(frozen=True, kw_only=True)
class ContextCompaction(Model):
    """One compaction or clear of one agent's context, from the line that asked for it to the first context
    size read after it ended. The line is the text typed into the agent's terminal."""

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

    def blocks_request_at(self, timestamp: Timestamp) -> bool:
        if self.state is CompactionState.STARTED:
            return True
        return self.state is CompactionState.REQUESTED and self.creation_timestamp().elapsed_seconds(timestamp) < RETRY_SECONDS

    def refusal_text(self) -> str:
        return f"a {self.change.value} is {self.state.value} since {self.creation_timestamp().value.strftime('%H:%M')}"

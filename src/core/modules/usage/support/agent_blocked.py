from core.base.timestamp import Timestamp
from core.modules.usage.models.agent_card import AgentCard

TASK_BLOCKED_REASON = "its task is blocked"
REASON_CHARACTERS = 100


class AgentBlocked:
    """Whether an agent's card says Blocked, and why: an agent is blocked when the task in its hands is blocked, or
    when the journal has held it for at least the given seconds; a shorter hold is the journal asking for something
    small, such as reading the task, and an ended agent is never blocked."""

    def __init__(self, seconds: int) -> None:
        self.seconds = seconds

    def reason(self, card: AgentCard, current_time: Timestamp) -> str:
        if card.holds_blocked_task:
            return TASK_BLOCKED_REASON
        if card.blocked_since and Timestamp.parsed(card.blocked_since).elapsed_seconds(current_time) >= self.seconds:
            return " ".join(card.block_reason.split())[:REASON_CHARACTERS] or "held by the journal"
        return ""

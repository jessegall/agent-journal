from core.base.timestamp import Timestamp

TIMEOUTS_TO_TELL = 3
SPAN_SECONDS = 600


class HookTimeouts:
    """The hooks of each agent the journal answered after the program had given up on them, kept for the span they count in,
    and when each agent's timeouts were last told; it lives as long as the server."""

    def __init__(self) -> None:
        self.timed_out_at: dict[int, list[Timestamp]] = {}
        self.told_at: dict[int, Timestamp] = {}

    def record(self, agent_id: int, at: Timestamp) -> int:
        recent = [moment for moment in self.timed_out_at.get(agent_id, []) if moment.elapsed_seconds(at) < SPAN_SECONDS]
        recent.append(at)
        self.timed_out_at[agent_id] = recent
        return len(recent)

    def is_due(self, agent_id: int, count: int, at: Timestamp) -> bool:
        told = self.told_at.get(agent_id)
        return count >= TIMEOUTS_TO_TELL and (told is None or told.elapsed_seconds(at) >= SPAN_SECONDS)

    def tell(self, agent_id: int, at: Timestamp) -> None:
        self.told_at[agent_id] = at

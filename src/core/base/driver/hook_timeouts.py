from engine.time.timestamp import Timestamp

NOTICE_TIMEOUT_COUNT = 3
SPAN_SECONDS = 600


class HookTimeouts:
    """The hooks of each agent the journal answered after the program had given up on them, kept for the span
    they count in, and when each agent's timeouts were last told; it lives as long as the server."""

    def __init__(self) -> None:
        self.timeout_stamps: dict[int, list[Timestamp]] = {}
        self.notice_stamps: dict[int, Timestamp] = {}

    def record(self, agent_id: int, timestamp: Timestamp) -> int:
        recent = [timeout for timeout in self.timeout_stamps.get(agent_id, []) if timeout.elapsed_seconds(timestamp) < SPAN_SECONDS]
        recent.append(timestamp)
        self.timeout_stamps[agent_id] = recent
        return len(recent)

    def needs_notice(self, agent_id: int, count: int, timestamp: Timestamp) -> bool:
        last_notice = self.notice_stamps.get(agent_id)
        return count >= NOTICE_TIMEOUT_COUNT and (last_notice is None or last_notice.elapsed_seconds(timestamp) >= SPAN_SECONDS)

    def notify(self, agent_id: int, timestamp: Timestamp) -> None:
        self.notice_stamps[agent_id] = timestamp

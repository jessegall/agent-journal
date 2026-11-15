from engine.agent_machine.states.line_history import LineHistory
from engine.time.timestamp import Timestamp
from core.modules.drivers.support.agent_line_histories import AgentLineHistories


class TableLineHistory(LineHistory):
    """Reads when a source last spoke from the agent's line history rows; an agent's rows are read once a request."""

    def __init__(self, histories: AgentLineHistories) -> None:
        self.histories = histories

    def last_spoke(self, source_key: str, agent_id: int) -> Timestamp | None:
        row = self.histories.rows(agent_id).get(source_key)
        return row.last_said_at if row is not None else None

from engine.command.context import Context
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.context_change_requests import ContextChangeRequests
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.context_change import ContextChange
from core.modules.drivers.support.context_compactions import ContextCompactions
from core.modules.drivers.support.current_context_window import CurrentContextWindow


class RecordedContextChangeRequests(ContextChangeRequests):
    """Records each request to compact or clear an agent's context as a row with the context size it is asked at,
    and refuses it while a compaction of that agent is open."""

    def __init__(self, compactions: ContextCompactions, current_window: CurrentContextWindow) -> None:
        self.compactions, self.current_window = compactions, current_window

    def record(self, agent: Agent, change: str, reason: str, line: str, context: Context) -> None:
        self.compactions.request(agent.id, ContextChange(change), CompactionReason(reason), self.current_window.window(agent).total_input_tokens, line, context)

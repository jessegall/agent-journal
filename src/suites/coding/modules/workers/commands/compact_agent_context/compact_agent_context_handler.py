from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.commands.choose_agent_control.choose_agent_control import ChooseAgentControl
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.support.context_limit_check import ContextLimitCheck
from suites.coding.modules.workers.support.worker_compaction import CONTROL_KEY



class CompactAgentContextHandler(Handler[CompactAgentContext, None]):
    """Types the context-limit action into the agent's terminal and records the context size it was asked at."""

    command = CompactAgentContext

    def __init__(self, bus: Bus, limit_check: ContextLimitCheck) -> None:
        self.bus, self.limit_check = bus, limit_check

    def handle(self, command: CompactAgentContext, context: Context) -> None:
        self.bus.dispatch(ChooseAgentControl(command.agent_id, CONTROL_KEY, self.limit_check.action()), context)
        self.limit_check.record_request(command.agent_id, context.timestamp)

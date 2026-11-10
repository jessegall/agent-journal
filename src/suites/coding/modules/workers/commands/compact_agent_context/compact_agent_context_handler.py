from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.commands.choose_agent_control.choose_agent_control import ChooseAgentControl
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.support.context_limit_check import ContextLimitCheck
from suites.coding.modules.workers.support.worker_compaction import CONTROL_KEY
from engine.provider.providers import Providers
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.enums.context_change import ContextChange
from core.modules.drivers.support.context_compactions import ContextCompactions



class CompactAgentContextHandler(Handler[CompactAgentContext, None]):
    """Records the compaction with the context size it is asked at and the line to type, then types the
    context-limit action into the agent's terminal."""

    command = CompactAgentContext

    def __init__(self, bus: Bus, limit_check: ContextLimitCheck, compactions: ContextCompactions, agents: AgentRows, providers: Providers) -> None:
        self.bus, self.limit_check, self.compactions, self.agents, self.providers = bus, limit_check, compactions, agents, providers

    def handle(self, command: CompactAgentContext, context: Context) -> None:
        action = self.limit_check.action()
        self.compactions.request(command.agent_id, ContextChange(action), command.reason, self.limit_check.tokens(command.agent_id), self.control_line(command.agent_id, action), context)
        self.bus.dispatch(ChooseAgentControl(command.agent_id, CONTROL_KEY, action), context)

    def control_line(self, agent_id: int, action: str) -> str:
        controls = self.providers.provider(self.agents.find(agent_id).program).controls
        return next((choice.line for group in controls if group.key == CONTROL_KEY for choice in group.choices if choice.value == action), "")

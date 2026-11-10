from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.commands.choose_agent_control.choose_agent_control import ChooseAgentControl
from core.modules.agents.support.context_change_requests import CONTEXT_CONTROL_KEY
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.support.context_limit_check import ContextLimitCheck


class CompactAgentContextHandler(Handler[CompactAgentContext, None]):
    """Applies the context-limit action to the agent as its context control, with the rule's reason: the control
    records the request and types its line."""

    command = CompactAgentContext

    def __init__(self, bus: Bus, limit_check: ContextLimitCheck) -> None:
        self.bus, self.limit_check = bus, limit_check

    def handle(self, command: CompactAgentContext, context: Context) -> None:
        self.bus.dispatch(ChooseAgentControl(command.agent_id, CONTEXT_CONTROL_KEY, self.limit_check.action(), command.reason.value), context)

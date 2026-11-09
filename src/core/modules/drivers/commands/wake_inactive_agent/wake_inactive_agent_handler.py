from core.modules.drivers.commands.support.agent_wake_handler import AgentWakeHandler
from core.modules.drivers.commands.wake_inactive_agent.wake_inactive_agent import WakeInactiveAgent
from core.modules.drivers.support.driver_nudges import CACHE_KEEPALIVE

WAKE_SOURCE = "drivers.cache_keepalive"


class WakeInactiveAgentHandler(AgentWakeHandler[WakeInactiveAgent]):
    """Saves the keepalive line for the agent and types it, with the lines that wait."""

    command = WakeInactiveAgent
    wake_nudge = CACHE_KEEPALIVE
    wake_source = WAKE_SOURCE

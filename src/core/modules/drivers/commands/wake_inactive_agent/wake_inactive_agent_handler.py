from core.modules.drivers.commands.support.wake_agent_handler import WakeAgentHandler
from core.modules.drivers.commands.wake_inactive_agent.wake_inactive_agent import WakeInactiveAgent
from core.modules.drivers.nudges.cache_keepalive_message import CacheKeepaliveMessage

WAKE_SOURCE = "drivers.cache_keepalive"


class WakeInactiveAgentHandler(WakeAgentHandler[WakeInactiveAgent]):
    """Saves the keepalive line for the agent and types it, with the lines that wait."""

    command = WakeInactiveAgent
    wake_nudge = CacheKeepaliveMessage.declared()
    wake_source = WAKE_SOURCE

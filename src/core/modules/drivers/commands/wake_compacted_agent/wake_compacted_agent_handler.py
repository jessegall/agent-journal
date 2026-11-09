from core.modules.drivers.commands.support.agent_wake_handler import AgentWakeHandler
from core.modules.drivers.commands.wake_compacted_agent.wake_compacted_agent import WakeCompactedAgent
from core.modules.drivers.support.driver_nudges import AGENT_COMPACTED
from core.modules.drivers.support.waiting_line_typing import COMPACTED_WAKE_SOURCE


class WakeCompactedAgentHandler(AgentWakeHandler[WakeCompactedAgent]):
    """Saves the wake line for the agent and types it, with the lines that wait."""

    command = WakeCompactedAgent
    wake_nudge = AGENT_COMPACTED
    wake_source = COMPACTED_WAKE_SOURCE
